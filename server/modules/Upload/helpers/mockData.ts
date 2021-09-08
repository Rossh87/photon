import { CreateResumableUploadResponse } from '@google-cloud/storage';
import { ObjectId } from 'mongodb';
import {
	ICombinedUploadRequestMetadata,
	IDBUpload,
	IUploadRequestMetadata,
	IUploadsRequestPayload,
} from 'sharedTypes/Upload';
import { ISavedBreakpoint } from 'sharedTypes/Breakpoint';

export const mockUploadRequestObject: IUploadRequestMetadata = {
	ownerID: '1234',
	sizeInBytes: 200240,
	displayName: 'someIMG.jpg',
	integrityHash: 'adbcdefgh',
	primaryColor: 'red',
	mediaType: 'image/jpeg',
	width: 250,
};

export const mockCombinedUploadRequest: ICombinedUploadRequestMetadata = {
	ownerID: 'abc123',
	displayName: 'someFile.jpg',
	mediaType: 'image/jpeg',
	sizeInBytes: 1000,
	integrityHash: ['123abc', '456def'],
	availableWidths: [250, 700],
	publicPathPrefix: 'googlestorage/1234/someFile.jpg',
};

export const mockUploadsRequestPayload: IUploadsRequestPayload = {
	uploadRequests: [{ ...mockUploadRequestObject }],
};

export const mockExistingBreakpoints: ISavedBreakpoint[] = [
	{
		queryType: 'min',
		mediaWidth: 800,
		slotWidth: 200,
		slotUnit: 'px',
		_id: '1234',
	},
	{
		queryType: 'max',
		mediaWidth: 1150,
		slotWidth: 600,
		slotUnit: 'vw',
		_id: '5678',
	},
];

export const mockIncomingBreakpoints: ISavedBreakpoint[] = [
	{
		queryType: 'max',
		mediaWidth: 500,
		slotWidth: 200,
		slotUnit: 'px',
		_id: 'kk42',
	},
	{
		queryType: 'min',
		mediaWidth: 200,
		slotWidth: 600,
		slotUnit: 'px',
		_id: 'izp9x',
	},
];

export const mockObjectIDs = Array(4)
	.fill(null)
	.map((_) => new ObjectId());

export const mockUploadsFromDb: IDBUpload[] = [
	{
		_id: mockObjectIDs[0],
		ownerID: '5678',
		displayName: 'beach day',
		mediaType: 'image/jpeg',
		sizeInBytes: 40956,
		integrityHash: ['a', 'b', 'c'],
		availableWidths: [250, 700, 1260],
		publicPathPrefix: 'https://google.uploads.mock/beach day',
		breakpoints: mockExistingBreakpoints,
	},
	{
		_id: mockObjectIDs[1],
		ownerID: '5678',
		displayName: 'foxes',
		mediaType: 'image/jpeg',
		sizeInBytes: 409,
		integrityHash: ['a', 'b', 'c'],
		availableWidths: [250, 700, 1260],
		publicPathPrefix: 'https://google.uploads.mock/foxes',
		breakpoints: mockExistingBreakpoints,
	},
	{
		_id: mockObjectIDs[2],
		ownerID: '1234',
		displayName: 'cats',
		mediaType: 'image/jpeg',
		sizeInBytes: 40956,
		integrityHash: ['a', 'b', 'c'],
		availableWidths: [250, 700, 1260],
		publicPathPrefix: 'https://google.uploads.mock/cats',
		breakpoints: mockExistingBreakpoints,
	},
	{
		_id: mockObjectIDs[3],
		ownerID: '1234',
		displayName: 'forest in spring',
		mediaType: 'image/jpeg',
		sizeInBytes: 40956,
		integrityHash: ['a', 'b', 'c'],
		availableWidths: [250, 700, 1260],
		publicPathPrefix: 'https://google.uploads.mock/forest in spring',
		breakpoints: mockExistingBreakpoints,
	},
];
export const mockUploadRequestResponse: CreateResumableUploadResponse = [
	'https://google.uploads.mock',
];
