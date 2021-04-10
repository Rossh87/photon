import { IAsyncDependencies } from '../../../../core/sharedTypes';

export const dispatchSuccesses = (fileName: string) => (
	deps: IAsyncDependencies
) => deps.dispatch({ type: 'UPLOAD_SUCCESS', data: fileName });
