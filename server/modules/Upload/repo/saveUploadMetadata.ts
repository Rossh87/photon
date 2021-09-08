import { ICombinedUploadRequestMetadata } from '../sharedUploadTypes';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { getCollection, trySaveOne } from '../../../core/repo';
import { pipe } from 'fp-ts/lib/function';
import { IDBUpload, TWithoutID } from 'sharedTypes/Upload';
import { tryCatch } from 'fp-ts/TaskEither';
import { DBTransactionError } from '../../../core/repo';
import { ObjectId } from 'mongodb';
import { TDBUser } from '../../../../sharedTypes/User';

export const saveUploadMetadata =
	(data: TWithoutID<IDBUpload>) =>
	({ repoClient }: IAsyncDeps) =>
		tryCatch(
			async () => {
				const userID = new ObjectId(data.ownerID);

				// get the needed collections
				const userColl = repoClient.db('photon').collection('users');
				const uploadColl = repoClient
					.db('photon')
					.collection('uploads');

				const user = (await userColl.findOne({
					_id: userID,
				})) as TDBUser;

				// update user data
				await userColl.findOneAndUpdate(
					{ _id: userID },
					{
						$set: {
							imageCount: user.imageCount + 1,
							uploadUsage: user.uploadUsage + data.sizeInBytes,
						},
					}
				);

				// add the new upload.  We cast to stop compiler from complaining
				// about missing _id field on new Upload data.
				await uploadColl.insertOne(data as IDBUpload);

				return data;
			},
			(e) => {
				return DBTransactionError.create(
					'Multi-part updates to add a new Upload object was forced to abort; MANUALLY RESET',
					e
				);
			}
		);
