import { IDependencies } from '../../../../core/dependencyContext';
import {
	IUploadFailureData,
	TUploaderActions,
} from '../../state/uploadStateTypes';
import { ReaderTask } from 'fp-ts/lib/ReaderTask';

// Return a ReaderTask here for ease of folding inside a ReaderTaskEither
export const dispatchUploadFailure = (
	failureData: IUploadFailureData
): ReaderTask<IDependencies<TUploaderActions>, void> => (deps) => () =>
	Promise.resolve(
		deps.dispatch({ type: 'UPLOAD_FAILED', data: failureData })
	);
