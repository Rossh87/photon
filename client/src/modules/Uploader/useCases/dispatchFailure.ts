import { IDependencies } from '../../../core/dependencyContext';
import { IUploadFailureData, TUploaderActions } from '../state/uploadStateTypes';

export const dispatchFailure = (failureData: IUploadFailureData) => (
	deps: IDependencies<TUploaderActions
) => deps.dispatch({ type: 'UPLOAD_FAILED', data: failureData });
