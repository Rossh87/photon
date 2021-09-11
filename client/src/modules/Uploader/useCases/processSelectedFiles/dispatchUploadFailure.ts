import { IDependencies } from '../../../../core/dependencyContext';
import { IUploadFailureData } from '../../state/uploadStateTypes';
import { ReaderTask } from 'fp-ts/lib/ReaderTask';
import { TAppAction } from '../../../appState/appStateTypes';

// Return a ReaderTask here for ease of folding inside a ReaderTaskEither
export const dispatchUploadFailure =
	(
		failureData: IUploadFailureData
	): ReaderTask<IDependencies<TAppAction>, void> =>
	(deps) =>
	() =>
		Promise.resolve(
			deps.dispatch({
				type: 'UPLOADER/UPLOAD_FAILED',
				payload: failureData,
			})
		);
