// lifted from imageCompression type defs, which don't export this.
export interface ICompressionOptions {
	maxSizeMB?: number;
	maxWidthOrHeight?: number;
	useWebWorker?: boolean;
	maxIteration?: number;
	exifOrientation?: number;
	onProgress?: (progress: number) => void;
	fileType?: string;
	initialQuality?: number;
}

export type TImageDimensions = [number, number];

import { IFetcher } from '../../core/sharedTypes';
import { IPreprocessedFile } from '../../modules/upload/UploadManager/uploadPreprocessing/uploadPreprocessingTypes';
import { Dispatch } from 'react';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { UploadError } from '../../modules/upload/UploadManager/uploadProcessing/UploadError';

export type TUploadActions =
	| IUploadInitFailedAction
	| IUploadFailedAction
	| IUploadSuccessAction;

export interface IUploadAction<T> {
	type: string;
	data: T;
}

export type TUploadProcessingErrors = NonEmptyArray<UploadError>;

export interface IUploadInitFailedAction extends IUploadAction<IResizingData> {
	type: 'INIT_UPLOAD_REQUEST_FAILED';
}

export interface IUploadSuccessAction extends IUploadAction<string> {
	type: 'UPLOAD_SUCCESS';
}

export interface IUploadFailedAction extends IUploadAction<UploadError> {
	type: 'UPLOAD_FAILED';
}

export interface IUploadRequestMetadata {
	ownerID: string;
	displayName: string;
	mediaType: string;
	sizeInBytes: number;
	integrityHash: string;
	primaryColor?: string;
	width: number;
}

export interface IUploadableBlob {
	blob: Blob;
	metaData: IUploadRequestMetadata;
}

export interface IResizingData extends IPreprocessedFile {
	originalCanvas: HTMLCanvasElement;
	neededWidths: Array<number>;
	resizedBlobs: ReadonlyArray<IUploadableBlob>;
}

export interface IAsyncUploadDependencies {
	fetcher: IFetcher;
	dispatch: Dispatch<TUploadActions>;
}

export interface IUploadableBlob {}

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
