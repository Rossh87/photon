import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { ResumableUploadCreationErr } from './helpers/requestResumableUpload';

export interface IUploadRequestMetadata {
	ownerID: string;
	sizeInBytes: number;
	displayName: string;
	integrityHash: string;
	primaryColor: string;
	mediaType: string;
	sizeParam: string;
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

export type TRequestedUploads = NonEmptyArray<IUploadRequestMetadata>;
