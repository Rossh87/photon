import { IAsyncDeps } from '../../../core/asyncDeps';
import { DBTransactionError } from '../../../core/repo';
import { pipe } from 'fp-ts/lib/function';
import { IDBUpload, TWithoutID } from 'sharedTypes/Upload';
import { tryCatch } from 'fp-ts/TaskEither';
import { TDBUser } from 'sharedTypes/User';
import { ObjectId, TransactionOptions } from 'mongodb';
import { map } from 'fp-ts/TaskEither';

// this is not currently in-use, but will be swapped in in production, assuming
// we have a replica set...Need to set up xaction options beforehand.

// xaction should do 2 things: save a new upload object, and update the user's usage object
export const saveUploadMetadata =
	(data: TWithoutID<IDBUpload>) =>
	({ repoClient }: IAsyncDeps) => {
		const session = repoClient.startSession();

		return pipe(
			tryCatch(
				() =>
					session.withTransaction(async () => {
						const userID = new ObjectId(data.ownerID);
						// get the needed collections
						const userColl = repoClient
							.db('photon')
							.collection('users');
						const uploadColl = repoClient
							.db('photon')
							.collection('uploads');

						const user = (await userColl.findOne({
							_id: userID,
						})) as TDBUser;

						// update user data
						await userColl.findOneAndUpdate(
							{ _id: new ObjectId(data.ownerID) },
							{
								$set: {
									imageCount: user.imageCount + 1,
									uploadUsage:
										user.uploadUsage + data.sizeInBytes,
								},
							},
							{ session }
						);

						// add the new upload.  We cast to stop compiler from complaining
						// about missing _id field on new Upload data.
						await uploadColl.insertOne(data as IDBUpload, {
							session,
						});
					}),
				(e) => {
					return DBTransactionError.create(
						'Transaction to add a new Upload object was forced to abort; rolling back.',
						e
					);
				}
			),
			map(() => {
				return data;
			})
		);
	};
