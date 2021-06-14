import { ICombinedUploadRequestMetadata } from '../sharedUploadTypes';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { getCollection, tryFindArray } from '../../../core/repo';
import { pipe } from 'fp-ts/lib/function';

export const getUploadMetadata = (ownerID: string) => (deps: IAsyncDeps) =>
	pipe(
		deps.repoClient,
		getCollection<ICombinedUploadRequestMetadata>('uploads'),
		tryFindArray<ICombinedUploadRequestMetadata>({ ownerID })({
			sort: { _id: -1 },
		})
	);
