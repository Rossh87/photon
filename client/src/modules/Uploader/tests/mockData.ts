import { TAuthorizedUserResponse } from 'sharedTypes/User';
import { IImage, IResizingData } from '../domain/domainTypes';
import {
    IUploadRequestMetadata,
    IUploadsResponsePayload,
    ResumableUploadCreationErr,
} from '../http/httpTypes';
import { of as TEOf } from 'fp-ts/lib/TaskEither';

export const mockUser: TAuthorizedUserResponse = {
    _id: '1234',
    identityProvider: 'google',
    identityProviderID: 'kk174635',
    thumbnailURL: 'someImg@domain.com',
    displayName: 'userGuy',
    familyName: 'tibbers',
    givenName: 'tom',
    registeredEmail: 'tom@tom.com',
    registeredEmailVerified: true,
    registeredDomains: ['www.mydomain.com'],
    imageCount: 2,
    uploadUsage: 102466,
    accessLevel: 'demo',
    createdAt: new Date().toJSON(),
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
    mediaType: 'image/jpeg',
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
