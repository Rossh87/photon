import { IDependencies } from '../../../../core/sharedTypes';
import { IUploadFailureData } from '../uploadState/stateTypes';

export const dispatchFailure = (failureData: IUploadFailureData) => (
	deps: IDependencies
) => deps.dispatch({ type: 'UPLOAD_FAILED', data: failureData });
