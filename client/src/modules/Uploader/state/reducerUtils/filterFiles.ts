import { filter } from 'fp-ts/lib/NonEmptyArray';
import { flow } from 'fp-ts/lib/function';
import { getOrElse } from 'fp-ts/lib/Option';
import { IImage, TPreprocessingResults } from '../../domain/domainTypes';

export const makeImageNameFilter = (nameForRemoval: string) =>
	filter((file: IImage) => file.displayName !== nameForRemoval);

export const filterOneImageFile = (nameForRemoval: string) =>
	flow(
		makeImageNameFilter(nameForRemoval),
		getOrElse<TPreprocessingResults | []>(() => [])
	);
