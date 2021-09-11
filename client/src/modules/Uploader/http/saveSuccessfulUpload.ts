import { ICombinedUploadRequestMetadata } from 'sharedTypes/Upload';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { SAVE_SUCCESSFUL_UPLOAD_DATA_ENDPOINT } from './endpoints';
import { BaseError } from '../../../core/error';
import { IHTTPLib } from '../../../core/sharedClientTypes';
import { THTTPRunner, IDependencies } from '../../../core/dependencyContext';
import { pipe, flow } from 'fp-ts/lib/function';
import { TUploaderActions } from '../state/uploadStateTypes';
import { local } from 'fp-ts/lib/ReaderTaskEither';
import { TAppAction } from '../../appState/appStateTypes';

const saveUploadData =
	(imgData: ICombinedUploadRequestMetadata) => (httpLib: IHTTPLib) =>
		httpLib.post(SAVE_SUCCESSFUL_UPLOAD_DATA_ENDPOINT, imgData, {
			withCredentials: true,
		});

export const _saveSuccessfulUpload =
	(imgData: ICombinedUploadRequestMetadata) => (httpRunner: THTTPRunner) =>
		tryCatch(
			() => pipe(imgData, saveUploadData, httpRunner),
			(e) =>
				new BaseError(
					'Image successfully uploaded, but request to save upload payload failed',
					e
				)
		);

export const saveSuccessfulUpload = flow(
	_saveSuccessfulUpload,
	local<IDependencies<TAppAction>, THTTPRunner>((deps) => deps.http)
);
