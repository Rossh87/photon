import { ICombinedUploadRequestMetadata } from '../sharedUploadTypes';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { getCollection, trySaveOne } from '../../../core/repo';
import { pipe } from 'fp-ts/lib/function';

export const saveUploadMetadata = (data: ICombinedUploadRequestMetadata) => (
	deps: IAsyncDeps
) =>
	pipe(
		deps.repoClient,
		getCollection<ICombinedUploadRequestMetadata>('uploads'),
		trySaveOne(data)
	);
