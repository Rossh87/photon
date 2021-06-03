import { IDependencies } from '../../../../core/dependencyContext';
import { IImage } from '../../domain/domainTypes';
import { TUploaderActions } from '../../state/uploadStateTypes';

// Return a ReaderTask here for ease of folding inside a ReaderTaskEither
export const dispatchInitUpload =
	(file: IImage) => (deps: IDependencies<TUploaderActions>) =>
		deps.dispatch({ type: 'INIT_UPLOAD', payload: file.displayName });
