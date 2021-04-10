import { IAsyncDependencies } from '../../../../core/sharedTypes';
import { IUploadFailureData } from '../uploadState/stateTypes';

export const dispatchFailure = (failureData: IUploadFailureData) => (
	deps: IAsyncDependencies
) => deps.dispatch({ type: 'UPLOAD_FAILED', data: failureData });
