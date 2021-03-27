import { filter } from 'fp-ts/lib/NonEmptyArray';
import { ImagePreprocessError } from '../../../../core/imageReducer/preprocessImages/ImagePreprocessError';
import { flow } from 'fp-ts/lib/function';
import { getOrElse } from 'fp-ts/lib/Option';
import {
	TPreprocessedFiles,
	TPreprocessErrors,
	IPreprocessedFile,
} from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';

export const makeFileNameFilter = (nameForRemoval: string) =>
	filter((file: IPreprocessedFile) => file.displayName !== nameForRemoval);

export const makeErrorNameFilter = (nameForRemoval: string) =>
	filter(
		(err: ImagePreprocessError) =>
			err.invalidFile?.displayName !== nameForRemoval
	);

export const filterOneError = (nameForRemoval: string) =>
	flow(
		makeErrorNameFilter(nameForRemoval),
		getOrElse<TPreprocessErrors | []>(() => [])
	);

export const filterOneFile = (nameForRemoval: string) =>
	flow(
		makeFileNameFilter(nameForRemoval),
		getOrElse<TPreprocessedFiles | []>(() => [])
	);
