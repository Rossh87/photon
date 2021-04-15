import { foldImageDataForRecall } from './foldImageDataForRecall';
import { IResizingData } from '../../domain/domainTypes'
import { IDependencies } from '../../../../core/dependencyContext';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { SAVE_SUCCESSFUL_UPLOAD_DATA_ENDPOINT } from '../../http/endpoints'
import { BaseError } from '../../../../core/error';
import {TUploaderActions} from '../../state/uploadStateTypes';

export const saveSuccessfulUpload = (imgData: IResizingData) => (
	deps: IDependencies<TUploaderActions
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
