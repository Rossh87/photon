import { pipe } from 'fp-ts/lib/function';
import { foldImageDataForRecall } from '../../../../core/imageReducer/foldImageDataForRecall';
import { IResizingData } from '../../../../core/imageReducer/resizeImage/imageReducerTypes';
import { IAsyncDependencies } from '../../../../core/sharedTypes';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { SAVE_SUCCESSFUL_UPLOAD_DATA_ENDPOINT } from '../../../../CONSTANTS';
import { BaseError } from '../../../../core/error';

export const saveSuccessfulUpload = (imgData: IResizingData) => (
	deps: IAsyncDependencies
) =>
	tryCatch(
		() =>
			deps.fetcher.post(
				SAVE_SUCCESSFUL_UPLOAD_DATA_ENDPOINT,
				foldImageDataForRecall(imgData)
			),
		(e) =>
			new BaseError(
				'Image successfully uploaded, but request to save upload data failed',
				e
			)
	);
