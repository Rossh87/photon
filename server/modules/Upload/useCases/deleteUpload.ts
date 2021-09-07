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
import { ObjectId } from 'bson';
import { fromNullable } from 'fp-ts/lib/Option';
import * as R from 'fp-ts/Reader';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import * as A from 'fp-ts/Array';

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

		// verify document is not null
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
					(u) => u.ownerID !== authenticatedID,
					(e) =>
						new BaseError(
							'unauthorizedRequest',
							HTTPErrorTypes.FORBIDDEN
						)
				)
			)
		),

		// perform local deletion
		// TODO: querying collection twice could be streamlined with 'DO' notation
		RTE.chainFirst((upload) =>
			R.asks((deps) => {
				const coll = getCollection<IDBUpload>('uploads')(
					deps.repoClient
				);

				return TE.tryCatch(
					() => coll.deleteOne({ _id: upload._id }),
					(e) =>
						DBDeletionError.create(
							'uploads',
							{ _id: upload._id },
							e
						)
				);
			})
		),

		// Delete from GCS
		RTE.bindTo('upload'),
		RTE.apS('deps', RTE.ask()),
		RTE.chainTaskEitherK(({ upload, deps }) => {
			const bucketName = deps.readEnv('GOOGLE_STORAGE_BUCKET_NAME');

			const { ownerID, displayName, availableWidths } = upload;

			const genFileName = (width: number) =>
				`${ownerID}/${displayName}/${width.toString()}`;

			const bucket = deps.gcs.bucket(bucketName);

			const processOne = flow(genFileName, (name) =>
				TE.tryCatch(
					() => bucket.file(name).delete(),
					(e) =>
						new BaseError(
							`Attempt to remove ${name} from GCS bucket failed`,
							HTTPErrorTypes.INTERNAL_SERVER_ERROR,
							e
						)
				)
			);
			// TODO: this will lead to 'hanging' documents on GCS storage
			// if some file delete requests succeed and others fail
			return pipe(
				availableWidths,
				A.map(processOne),
				A.sequence(TE.ApplicativePar)
			);
		})
	);
