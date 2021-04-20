import { IUser } from '../../auth/AuthManager/authTypes';
import { IImage, IResizingData } from '../domain/domainTypes';
import {
	IUploadRequestMetadata,
	IUploadsResponsePayload,
	ResumableUploadCreationErr,
} from '../http/httpTypes';
import { of as TEOf } from 'fp-ts/lib/TaskEither';

export const mockUser: IUser = {
	OAuthProviderName: 'google',
	_id: '1234',
	thumbnailURL: 'someImg@domain.com',
	displayName: 'userGuy',
	familyName: 'tibbers',
	givenName: 'tom',
	emailAddress: 'tom@tom.com',
};

// mockImageData includes some stubbed-out props that would normally be
// automatically populated by the File interface
export const mockImageData = {
	humanReadableSize: '1005',
	ownerID: '1234',
	displayName: 'processingTestImage',
	name: 'processingTestImage',
	originalSizeInBytes: 1024,
	status: 'preprocessed',
	size: 1024,
} as IImage;

export const mockUploadReqData: IUploadRequestMetadata = {
	ownerID: '1234',
	displayName: 'processingTestImage',
	mediaType: 'img/jpg',
	sizeInBytes: 1024,
	integrityHash: 'abc123',
	width: 250,
};

export const mockFailedURIRequestData: ResumableUploadCreationErr = {
	rawError: 'some failure',
	requestedUpload: mockUploadReqData,
	message: 'request for upload failed',
};

export const mockFailedURIRequestResponse: IUploadsResponsePayload = {
	failures: [mockFailedURIRequestData],
};

const _mockResizingData = Object.assign({}, mockImageData, {
	originalCanvas: document.createElement('canvas'),
	neededWidths: [250],
	resizedBlobs: [{ blob: new Blob(), metaData: mockUploadReqData }],
}) as IResizingData;

export const mockResizingData = TEOf(_mockResizingData);
