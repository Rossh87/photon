import { IUploadRequestMetadata } from '../sharedUploadTypes';
import { CreateResumableUploadResponse } from '@google-cloud/storage';

export const mockUploadRequestObject: IUploadRequestMetadata = {
	ownerID: '1234',
	sizeInBytes: 200240,
	displayName: 'someIMG.jpg',
	integrityHash: 'adbcdefgh',
	primaryColor: 'red',
	mediaType: 'image/jpeg',
};

export const mockUploadRequestResponse: CreateResumableUploadResponse = [
	'https://google.uploads.mock',
];
