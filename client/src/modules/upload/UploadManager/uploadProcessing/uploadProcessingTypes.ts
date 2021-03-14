import { IFetcher } from '../../../../core/sharedTypes';
import { IPreprocessedFile } from '../uploadPreprocessing/uploadPreprocessingTypes';
import { Dispatch } from 'react';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { UploadError } from './UploadError';

export type TUploadActions =
	| IUploadInitFailedAction
	| IUploadFailedAction
	| IUploadSuccessAction;

export interface IUploadAction<T> {
	type: string;
	data: T;
}

export type TUploadProcessingErrors = NonEmptyArray<UploadError>;

export interface IUploadInitFailedAction
	extends IUploadAction<IResizingMetadata> {
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
	sizeInBytes: number;
	displayName: string;
	integrityHash: string;
	primaryColor?: string;
	mediaType: string;
	sizeParam: string;
}

export interface IAsyncUploadDependencies {
	fetcher: IFetcher;
	dispatch: Dispatch<TUploadActions>;
}
export interface IResizingMetadata extends IPreprocessedFile {
	originalCanvas: HTMLCanvasElement;
	maxNeededSizeIdx: number;
	resizedBlobs: NonEmptyArray<IBlobWithIntegrityHash>;
}

export interface IBlobWithIntegrityHash {
	blob: Blob;
	integrityHash: string;
	sizeParam: string;
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
