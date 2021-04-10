import { IPreprocessedFile } from '../preprocessImages/imagePreprocessingTypes';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { ImageReducerError } from './ImageReducerError';

export type TImageDimensions = [number, number];

export type TImageReducerErrors = NonEmptyArray<ImageReducerError>;

// upload tail path is ownerID/displayName/width
export interface IUploadRequestMetadata {
	ownerID: string;
	displayName: string;
	mediaType: string;
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

export interface IUploadableBlob {
	blob: Blob;
	metaData: IUploadRequestMetadata;
}

export interface IResizingData extends IPreprocessedFile {
	originalCanvas: HTMLCanvasElement;
	neededWidths: NonEmptyArray<number>;
	resizedBlobs: NonEmptyArray<IUploadableBlob>;
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

export interface IUploadsRequestPayload {
	uploadRequests: NonEmptyArray<IUploadRequestMetadata>;
}

export interface IUploadsResponsePayload {
	successes?: NonEmptyArray<IUploadURIMetadata>;
	failures?: NonEmptyArray<ResumableUploadCreationErr>;
}

export type TSizeSelectionResult = [number, HTMLCanvasElement];

export type TRequestedUploads = NonEmptyArray<IUploadRequestMetadata>;
