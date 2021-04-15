import { map } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/function';
import { IResizingData, TPreprocessingResults } from '../../domain/domainTypes';

export const attachResizeData = (resizeData: IResizingData) => (
	imageFiles: TPreprocessingResults
) =>
	pipe(
		imageFiles,
		map((f) =>
			f.displayName === resizeData.displayName
				? Object.assign(f, { resizedImages: resizeData })
				: f
		)
	);
