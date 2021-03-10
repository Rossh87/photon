import { BaseError } from '../../../core/error';
import { IFetcher } from '../../../core/sharedTypes';
import * as E from 'fp-ts/lib/Either';
import { UploadError } from './UploadError';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { These } from 'fp-ts/lib/These';

// Begin image preprocessing types
export type TFilesArray = NonEmptyArray<File>;

export type TImageUploadStateStatus =
	| 'awaitingFileSelection'
	| 'validatingSelectedFiles'
	| 'preparingFilesForUpload'
	| 'uploading'
	| 'success'
	| 'failed';

export interface IPreprocessedFile extends File {
	humanReadableSize: string;
	ownerID: string;
	displayName: string;
	originalSizeInBytes: number;
}

export type TPreprocessedFiles = NonEmptyArray<IPreprocessedFile>;

export type TPreprocessErrors = NonEmptyArray<UploadError>;

export type TPreProcessResult = These<TPreprocessErrors, TPreprocessedFiles>;

// Begin upload state types
export interface IImageUploadState {
	status: TImageUploadStateStatus;
	selectedFiles: TPreprocessedFiles | [];
	errors: TPreprocessErrors | [];
}

export interface IFileAction<T> {
	type: string;
	data: T;
}

export interface IFilesSelectedAction extends IFileAction<TPreprocessedFiles> {
	type: 'FILES_SELECTED';
}

export interface IUnselectInvalidFileAction extends IFileAction<string> {
	type: 'UNSELECT_INVALID_FILE';
}

export interface IUnselectValidFileAction extends IFileAction<string> {
	type: 'UNSELECT_VALID_FILE';
}

export interface IInvalidFileSelectionAction
	extends IFileAction<TPreprocessErrors> {
	type: 'INVALID_FILE_SELECTIONS';
}

export interface IUpdateFileAction
	extends IFileAction<Partial<IPreprocessedFile>> {
	type: 'UPDATE_FILE';
	previousName: string;
}

export type TFileActions =
	| IFilesSelectedAction
	| IUnselectValidFileAction
	| IUnselectInvalidFileAction
	| IInvalidFileSelectionAction
	| IUpdateFileAction;

export interface IUploadReaderDependencies {
	ownerID: string;
}

// Begin types for requesting upload and processing image files
export interface IUploadRequestMetadata {
	ownerID: string;
	sizeInBytes: number;
	displayName: string;
	integrityHash: string;
	primaryColor: string;
	mediaType: string;
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
