import { ICombinedUploadRequestMetadata } from './httpTypes';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { SAVE_SUCCESSFUL_UPLOAD_DATA_ENDPOINT } from './endpoints';
import { BaseError } from '../../../core/error';
import { IHTTPLib } from '../../../core/sharedTypes';
import { THTTPRunner, IDependencies } from '../../../core/dependencyContext';
import { pipe, flow } from 'fp-ts/lib/function';
import { TUploaderActions } from '../state/uploadStateTypes';
import { local } from 'fp-ts/lib/ReaderTaskEither';

const saveUploadData = (imgData: ICombinedUploadRequestMetadata) => (
	httpLib: IHTTPLib
) => httpLib.post(SAVE_SUCCESSFUL_UPLOAD_DATA_ENDPOINT, imgData);

export const _saveSuccessfulUpload = (
	imgData: ICombinedUploadRequestMetadata
) => (httpRunner: THTTPRunner) =>
	tryCatch(
		() => pipe(imgData, saveUploadData, httpRunner),
		(e) =>
			new BaseError(
				'Image successfully uploaded, but request to save upload data failed',
				e
			)
	);

export const saveSuccessfulUpload = flow(
	_saveSuccessfulUpload,
	local<IDependencies<TUploaderActions>, THTTPRunner>((deps) => deps.http)
);
