import { ICombinedUploadRequestMetadata } from '../sharedUploadTypes';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { getCollection, tryFindArray } from '../../../core/repo';
import { pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export const getDupeDisplayNames =
	(ownerID: string) =>
	(submittedNames: NonEmptyArray<string>) =>
	(deps: IAsyncDeps) =>
		pipe(
			deps.repoClient,
			getCollection<ICombinedUploadRequestMetadata>('uploads'),
			tryFindArray<ICombinedUploadRequestMetadata>({
				ownerID,
				displayName: { $in: submittedNames },
			})({ projection: { displayName: 1, ownerID: 1 } })
		);
