import { ICombinedUploadRequestMetadata } from 'sharedTypes/Upload';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { DBReadError, getCollection, tryFindArray } from '../../../core/repo';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import { ObjectId } from 'mongodb';

export const getUploadMetadata = (ownerID: string) => (deps: IAsyncDeps) =>
	pipe(
		deps.repoClient,
		getCollection<ICombinedUploadRequestMetadata>('uploads'),
		(c) =>
			TE.tryCatch(
				() =>
					c
						.aggregate([
							{ $match: { ownerID: ownerID } },
							{ $sort: { _id: -1 } },
							{
								$set: {
									addedOn: {
										$toDate: {
											$getField: '_id',
										},
									},
								},
							},
						])
						.toArray(),
				(reason) => DBReadError.create(c.collectionName, {}, reason)
			)
	);
