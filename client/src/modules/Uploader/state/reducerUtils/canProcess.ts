import { pipe } from 'fp-ts/lib/function';
import { fromArray } from 'fp-ts/lib/NonEmptyArray';
import { IImageUploadState, TSelectedFilesState } from '../uploadStateTypes';
import { map as OMap, getOrElseW, isNone } from 'fp-ts/Option';
import { TPreprocessingResults } from '../../domain/domainTypes';

const isProblemFree = (a: TPreprocessingResults) =>
	a.every((x) => x.error === undefined && x.isUniqueDisplayName === 'yes');

export const canProcess = ({
	selectedFiles,
	componentLevelError,
}: IImageUploadState): boolean =>
	pipe(
		selectedFiles,
		fromArray,
		OMap(isProblemFree),
		getOrElseW(() => false)
	) && isNone(componentLevelError);
