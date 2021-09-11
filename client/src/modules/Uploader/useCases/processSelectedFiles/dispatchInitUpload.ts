import { IDependencies } from '../../../../core/dependencyContext';
import { TAppAction } from '../../../appState/appStateTypes';
import { IImage } from '../../domain/domainTypes';

// Return a ReaderTask here for ease of folding inside a ReaderTaskEither
export const dispatchInitUpload =
	(file: IImage) => (deps: IDependencies<TAppAction>) =>
		deps.dispatch({
			type: 'UPLOADER/INIT_UPLOAD',
			payload: file.displayName,
		});
