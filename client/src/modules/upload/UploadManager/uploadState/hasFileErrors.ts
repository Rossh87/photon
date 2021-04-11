import { map } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/function';
import { TPreprocessingResults } from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
import { IResizingData } from '../../../../core/imageReducer/resizeImage/imageReducerTypes';
import { foldRight } from 'fp-ts/lib/Array';

export const hasFileErrors = (selectedFiles: TPreprocessingResults | []) =>
	selectedFiles.length > 0
		? selectedFiles.some(
				(file) => file.error !== undefined && file.error !== null
		  )
		: false;
