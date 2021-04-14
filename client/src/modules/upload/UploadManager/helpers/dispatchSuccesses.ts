import { IDependencies } from '../../../../core/sharedTypes';

export const dispatchSuccesses = (fileName: string) => (deps: IDependencies) =>
	deps.dispatch({ type: 'UPLOAD_SUCCESS', data: fileName });
