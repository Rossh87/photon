import { BaseError } from '../../../core/error';
import { IFetcher } from '../../../core/sharedTypes';
import * as E from 'fp-ts/lib/Either';
import { UploadError } from './UploadError';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { These } from 'fp-ts/lib/These';

export type TFilesArray = NonEmptyArray<File>;

export type TImageUploadStateStatus =
	| 'awaitingFileSelection'
	| 'validatingSelectedFiles'
	| 'preparingFilesForUpload'
	| 'uploading'
	| 'success'
	| 'failed';

export interface IProcessedFile extends File {
	humanReadableSize: string;
	uploadPaths: Array<string>;
	ownerID: string;
	displayName: string;
}

export type TPreprocessedFiles = NonEmptyArray<IProcessedFile>;

export type TPreprocessErrors = NonEmptyArray<UploadError>;

export type TPreProcessResult = These<TPreprocessErrors, TPreprocessedFiles>;

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
	extends IFileAction<Partial<IProcessedFile>> {
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
