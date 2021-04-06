import { map } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/function';
import { TPreprocessingResults } from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
import { IResizingData } from '../../../../core/imageReducer/resizeImage/imageReducerTypes';

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
