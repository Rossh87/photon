import { _processUploadInitSuccess } from '../helpers/processUploadInitSuccess';
import {
	_requestResumableUpload,
	requestResumableUpload,
} from '../helpers/requestResumableUpload';
import {
	IDBUpload,
	IUploadRequestMetadata,
	TUploadDeletionID,
} from 'sharedTypes/Upload';
import {
	map as NEAMap,
	sequence as NEASequence,
} from 'fp-ts/lib/NonEmptyArray';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as RT from 'fp-ts/lib/ReaderTask';
import { pipe, flow } from 'fp-ts/lib/function';
import { toResponsePayload } from '../helpers/toResponsePayload';
import { IUploadDeletionPayload } from 'sharedTypes/Upload';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import {
	DBDeletionError,
	DBReadError,
	DBWriteError,
	getCollection,
	tryFindOne,
} from '../../../core/repo';
import { ObjectId } from 'mongodb';
import { fromNullable } from 'fp-ts/lib/Option';
import * as R from 'fp-ts/Reader';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import * as A from 'fp-ts/Array';
import { TDBUser } from '../../../../sharedTypes/User';
import * as O from 'fp-ts/Option';
import { gcsFileNamesFromUpload } from '../../../core/utils/gcsFileNamesFromUpload';

export const deleteUpload = (
	toDelete: IUploadDeletionPayload,
	authenticatedID: string
) =>
	pipe(
		RTE.of<IAsyncDeps, BaseError, IUploadDeletionPayload>(toDelete),

		// retrieve the requested document
		RTE.chain((p) =>
			R.asks(({ repoClient }) => {
				const coll = getCollection<IDBUpload>('uploads')(repoClient);

				return TE.tryCatch(
					() => coll.findOne({ _id: new ObjectId(p.idToDelete) }),
					(e) =>
						DBReadError.create(
							coll.collectionName,
							{ _id: new ObjectId(p.idToDelete) },
							e
						)
				);
			})
		),

		// verify document is not null.
		// This will also short-circuit duplicate request, which is a plus
		RTE.chainOptionK(
			() =>
				new BaseError(
					'upload requested for deletion was not found',
					HTTPErrorTypes.MISSING_OR_CONFLICTED_RESOURCE
				)
		)(fromNullable),

		// ensure request originated from document's owner
		RTE.chainEitherK(
			flow(
				E.fromPredicate(
					(u) => u.ownerID === authenticatedID,
					(e) =>
						new BaseError(
							'unauthorizedRequest',
							HTTPErrorTypes.FORBIDDEN,
							e
						)
				)
			)
		),

		// perform local deletion
		// TODO: querying collection twice could be streamlined with 'DO' notation
		RTE.chainFirst((upload) =>
			R.asks((deps) => {
				const uploadCollection = getCollection<IDBUpload>('uploads')(
					deps.repoClient
				);
				const userCollection = getCollection<TDBUser>('users')(
					deps.repoClient
				);

				const removeUpload = TE.tryCatch(
					() => uploadCollection.deleteOne({ _id: upload._id }),
					(e) =>
						DBDeletionError.create(
							'uploads',
							{ _id: upload._id },
							e
						)
				);

				const updateUserState = TE.tryCatch(
					() =>
						userCollection.findOneAndUpdate(
							{ _id: new ObjectId(authenticatedID) },
							{ $set: { imageCount: toDelete.updatedImageCount } }
						),
					(e) =>
						DBDeletionError.create(
							'uploads',
							{ _id: upload._id },
							e
						)
				);

				const verifyIncomingImageCount = pipe(
					TE.tryCatch(
						() =>
							userCollection.findOne({
								_id: new ObjectId(authenticatedID),
							}),
						(e) =>
							DBReadError.create(
								'users',
								{ _id: authenticatedID },
								e
							)
					),
					TE.chain(
						flow(
							O.fromNullable,
							TE.fromOption(
								() =>
									new BaseError(
										'Database user information was unable to be recovered for delete request',
										HTTPErrorTypes.MISSING_OR_CONFLICTED_RESOURCE
									)
							)
						)
					),
					TE.chain(
						TE.fromPredicate(
							(usr) =>
								usr.imageCount - 1 ===
								toDelete.updatedImageCount,
							(e) =>
								new BaseError(
									'User image count from incoming upload delete request inconsistent with existing records',
									HTTPErrorTypes.MISSING_OR_CONFLICTED_RESOURCE,
									e
								)
						)
					)
				);

				return pipe(
					// double-check we're not corrupting user metadata with bad
					// data from client
					verifyIncomingImageCount,
					// update user metadata
					TE.chain(() => updateUserState),
					// perform actual document deletion
					TE.chain(() => removeUpload)
				);
			})
		),

		// Delete from GCS
		RTE.bindTo('upload'),
		RTE.apS('deps', RTE.ask()),
		RTE.chainTaskEitherK(({ upload, deps }) => {
			const bucketName = deps.readEnv('LOSSY_USER_IMAGES_BUCKET');

			const bucket = deps.gcs.bucket(bucketName);

			const processOne = (name: string) =>
				TE.tryCatch(
					() => bucket.file(name).delete(),
					(e) =>
						new BaseError(
							`Attempt to remove ${name} from GCS bucket failed`,
							HTTPErrorTypes.INTERNAL_SERVER_ERROR,
							e
						)
				);

			// TODO: this will lead to 'hanging' documents on GCS storage
			// if some file delete requests succeed and others fail
			return pipe(
				upload,
				gcsFileNamesFromUpload,
				A.map(processOne),
				A.sequence(TE.ApplicativePar)
			);
		})
	);
