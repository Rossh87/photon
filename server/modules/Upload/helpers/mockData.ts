import {
	IUploadRequestMetadata,
	ICombinedUploadRequestMetadata,
} from '../sharedUploadTypes';
import { CreateResumableUploadResponse } from '@google-cloud/storage';
import { WithId } from 'mongodb';

export const mockUploadRequestObject: IUploadRequestMetadata = {
	ownerID: '1234',
	sizeInBytes: 200240,
	displayName: 'someIMG.jpg',
	integrityHash: 'adbcdefgh',
	primaryColor: 'red',
	mediaType: 'image/jpeg',
	width: 250,
};

export const mockUploadsFromDb: ICombinedUploadRequestMetadata[] = [
	{
		ownerID: '5678',
		displayName: 'beach day',
		mediaType: 'image/jpeg',
		sizeInBytes: 40956,
		integrityHash: ['a', 'b', 'c'],
		availableWidths: [250, 700, 1260],
		publicPathPrefix: 'https://google.uploads.mock/beach day',
	},
	{
		ownerID: '5678',
		displayName: 'foxes',
		mediaType: 'image/jpeg',
		sizeInBytes: 409,
		integrityHash: ['a', 'b', 'c'],
		availableWidths: [250, 700, 1260],
		publicPathPrefix: 'https://google.uploads.mock/foxes',
	},
	{
		ownerID: '1234',
		displayName: 'cats',
		mediaType: 'image/jpeg',
		sizeInBytes: 40956,
		integrityHash: ['a', 'b', 'c'],
		availableWidths: [250, 700, 1260],
		publicPathPrefix: 'https://google.uploads.mock/cats',
	},
	{
		ownerID: '1234',
		displayName: 'forest in spring',
		mediaType: 'image/jpeg',
		sizeInBytes: 40956,
		integrityHash: ['a', 'b', 'c'],
		availableWidths: [250, 700, 1260],
		publicPathPrefix: 'https://google.uploads.mock/forest in spring',
	},
];
export const mockUploadRequestResponse: CreateResumableUploadResponse = [
	'https://google.uploads.mock',
];
