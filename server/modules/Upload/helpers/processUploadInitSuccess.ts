import { CreateResumableUploadResponse } from '@google-cloud/storage';
import { IUploadRequestMetadata, IUploadURIMetadata } from 'sharedTypes/Upload';
import { reverseTwo } from '../../../core/utils/reverseCurried';

export const processUploadInitSuccess =
	(creationResponse: CreateResumableUploadResponse) =>
	(originalRequest: IUploadRequestMetadata): IUploadURIMetadata =>
		Object.assign(originalRequest, {
			resumableURI: creationResponse[0],
			// cast to prevent type-widening to boolean when type expects 'true'
			ok: true as true,
			uploadSessionIsOpen: true,
		});

export const _processUploadInitSuccess = reverseTwo(processUploadInitSuccess);
