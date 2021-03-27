import { filter } from 'fp-ts/lib/NonEmptyArray';
import { flow } from 'fp-ts/lib/function';
import { getOrElse } from 'fp-ts/lib/Option';
import {
	IPreprocessingResult,
	TPreprocessingResults,
} from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';

const getDisplayName = (f: IPreprocessingResult) =>
	f.error ? f.error.invalidFile.displayName : f.imageFile.displayName;

export const makeImageNameFilter = (nameForRemoval: string) =>
	filter(
		(file: IPreprocessingResult) => getDisplayName(file) !== nameForRemoval
	);

export const filterOneImageFile = (nameForRemoval: string) =>
	flow(
		makeImageNameFilter(nameForRemoval),
		getOrElse<TPreprocessingResults | []>(() => [])
	);
