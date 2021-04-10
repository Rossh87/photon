import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { ResumableUploadCreationErr } from './helpers/requestResumableUpload';

export interface IUploadRequestMetadata {
	ownerID: string;
	displayName: string;
	mediaType: string;
	sizeInBytes: number;
	integrityHash: string;
	primaryColor?: string;
	width: number;
}

export interface IUploadsRequestPayload {
	uploadRequests: NonEmptyArray<IUploadRequestMetadata>;
}

export interface IUploadsResponsePayload {
	successes?: NonEmptyArray<IUploadURIMetadata>;
	failures?: NonEmptyArray<ResumableUploadCreationErr>;
}

export interface IUploadURIMetadata extends IUploadRequestMetadata {
	resumableURI: string;
	uploadSessionIsOpen: boolean;
	ok: true;
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

export type TRequestedUploads = NonEmptyArray<IUploadRequestMetadata>;
