import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { TMediaType } from 'sharedTypes/Upload';

export interface IUploadsRequestPayload {
    uploadRequests: NonEmptyArray<IUploadRequestMetadata>;
}

export interface IUploadsResponsePayload {
    successes?: NonEmptyArray<IUploadURIMetadata>;
    failures?: NonEmptyArray<ResumableUploadCreationErr>;
}

export interface IUploadRequestMetadata {
    ownerID: string;
    displayName: string;
    mediaType: TMediaType;
    sizeInBytes: number;
    integrityHash: string;
    primaryColor?: string;
    width: number;
}

export interface ICombinedUploadRequestMetadata {
    ownerID: string;
    displayName: string;
    mediaType: string;
    sizeInBytes: number;
    integrityHash: NonEmptyArray<string>;
    primaryColor?: string;
    availableWidths: NonEmptyArray<number>;
    publicPathPrefix: string;
}

export interface IUploadURIMetadata extends IUploadRequestMetadata {
    resumableURI: string;
    uploadSessionIsOpen: boolean;
    ok: true;
}

export interface ResumableUploadCreationErr {
    rawError: any;
    requestedUpload: IUploadRequestMetadata;
    message: string;
}
