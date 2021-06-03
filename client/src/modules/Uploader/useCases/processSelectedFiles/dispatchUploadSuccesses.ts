import { IDependencies } from '../../../../core/dependencyContext';
import { TUploaderActions } from '../../state/uploadStateTypes';
import { ReaderTask } from 'fp-ts/lib/ReaderTask';

// Return a ReaderTask here for ease of folding inside a ReaderTaskEither
export const dispatchUploadSuccesses =
	(fileName: string): ReaderTask<IDependencies<TUploaderActions>, void> =>
	(deps) =>
	() =>
		Promise.resolve(
			deps.dispatch({ type: 'UPLOAD_SUCCESS', payload: fileName })
		);
