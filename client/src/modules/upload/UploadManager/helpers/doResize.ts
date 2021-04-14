import { IDependencies } from '../../../../core/sharedTypes';
import { IPreprocessedFile } from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
import { pipe } from 'fp-ts/lib/function';
import { map } from 'fp-ts/lib/TaskEither';

export const doResize = (file: IPreprocessedFile) => (deps: IDependencies) =>
	pipe(
		file,
		deps.imageReducer,
		map((resized) => {
			deps.dispatch({ type: 'IMAGES_EMITTED', data: resized });
			return resized;
		})
	);
