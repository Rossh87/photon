import { CreateResumableUploadResponse } from '@google-cloud/storage';
import {
	IUploadRequestMetadata,
	IUploadResponseMetadata,
} from '../sharedUploadTypes';
import { reverseTwo } from '../../../core/utils/reverseCurried';

export const processUploadInitSuccess = (
	creationResponse: CreateResumableUploadResponse
) => (originalRequest: IUploadRequestMetadata): IUploadResponseMetadata =>
	Object.assign(originalRequest, {
		resumableURI: creationResponse[0],
		// cast to prevent type-widening to boolean when type expects 'true'
		ok: true as true,
		uploadSessionIsOpen: true,
	});

export const _processUploadInitSuccess = reverseTwo(processUploadInitSuccess);
