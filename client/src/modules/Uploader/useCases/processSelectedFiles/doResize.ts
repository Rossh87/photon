import { IDependencies } from '../../../../core/dependencyContext';
import { IImage } from '../../domain/domainTypes';
import { pipe } from 'fp-ts/lib/function';
import { map } from 'fp-ts/lib/TaskEither';
import { TUploaderActions } from '../../state/uploadStateTypes';

export const doResize =
	(file: IImage) => (deps: IDependencies<TUploaderActions>) =>
		pipe(
			file,
			deps.imageReducer,
			map((resized) => {
				deps.dispatch({ type: 'IMAGES_EMITTED', payload: resized });
				return resized;
			})
		);
