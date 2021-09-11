import { IDependencies } from '../../../../core/dependencyContext';
import { IImage } from '../../domain/domainTypes';
import { pipe } from 'fp-ts/lib/function';
import { map } from 'fp-ts/lib/TaskEither';
import { TAppAction } from '../../../appState/appStateTypes';

export const doResize = (file: IImage) => (deps: IDependencies<TAppAction>) =>
	pipe(
		file,
		deps.imageReducer,
		map((resized) => {
			deps.dispatch({
				type: 'UPLOADER/IMAGES_EMITTED',
				payload: resized,
			});
			return resized;
		})
	);
