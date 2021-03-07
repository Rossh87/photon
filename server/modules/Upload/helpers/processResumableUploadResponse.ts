import { CreateResumableUploadResponse } from '@google-cloud/storage';
import {
	IUploadRequestMetadata,
	IUploadResponseMetadata,
} from '../sharedUploadTypes';

export const processResumableUploadResponse = (
	creationResponse: CreateResumableUploadResponse
) => (uploadRequest: IUploadRequestMetadata): IUploadResponseMetadata =>
	Object.assign(uploadRequest, { uploadURI: creationResponse[0] });
