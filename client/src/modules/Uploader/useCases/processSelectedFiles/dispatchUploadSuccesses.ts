import { IDependencies } from '../../../../core/dependencyContext';
import { ReaderTask } from 'fp-ts/lib/ReaderTask';
import { TAppAction } from '../../../appState/appStateTypes';

// Return a ReaderTask here for ease of folding inside a ReaderTaskEither
export const dispatchUploadSuccesses =
	(fileName: string): ReaderTask<IDependencies<TAppAction>, void> =>
	(deps) =>
	() =>
		Promise.resolve(
			deps.dispatch({
				type: 'UPLOADER/UPLOAD_SUCCESS',
				payload: fileName,
			})
		);
