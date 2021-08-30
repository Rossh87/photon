import { ICombinedUploadRequestMetadata } from '../sharedUploadTypes';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { getCollection, trySaveOne } from '../../../core/repo';
import { pipe } from 'fp-ts/lib/function';
import { IDBUpload, TWithoutID } from 'sharedTypes/Upload';

export const saveUploadMetadata =
	(data: TWithoutID<IDBUpload>) => (deps: IAsyncDeps) =>
		pipe(
			deps.repoClient,
			getCollection<TWithoutID<IDBUpload>>('uploads'),
			trySaveOne(data)
		);
