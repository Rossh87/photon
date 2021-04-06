import { filter } from 'fp-ts/lib/NonEmptyArray';
import { flow } from 'fp-ts/lib/function';
import { getOrElse } from 'fp-ts/lib/Option';
import {
	IPreprocessedFile,
	TPreprocessingResults,
} from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';

export const makeImageNameFilter = (nameForRemoval: string) =>
	filter((file: IPreprocessedFile) => file.displayName !== nameForRemoval);

export const filterOneImageFile = (nameForRemoval: string) =>
	flow(
		makeImageNameFilter(nameForRemoval),
		getOrElse<TPreprocessingResults | []>(() => [])
	);
