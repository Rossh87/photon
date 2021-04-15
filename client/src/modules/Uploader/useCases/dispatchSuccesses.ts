import { IDependencies } from '../../../core/dependencyContext';
import { TUploaderActions } from '../state/uploadStateTypes';

export const dispatchSuccesses = (fileName: string) => (
	deps: IDependencies<TUploaderActions>
) => deps.dispatch({ type: 'UPLOAD_SUCCESS', data: fileName });
