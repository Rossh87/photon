import { BaseError } from '../../../core/error';
import {
	TPreprocessErrors,
	IImage,
	TPreprocessingResults,
	IResizingData,
} from '../domain/domainTypes';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export type TFilesArray = NonEmptyArray<File>;

export type TImageUploadStateStatus =
	| 'awaitingFileSelection'
	| 'validatingSelectedFiles'
	| 'preparingFilesForUpload'
	| 'uploading'
	| 'success'
	| 'failed';

export type TSelectedFilesState = TPreprocessingResults | [];

export interface IImageUploadState {
	status: TImageUploadStateStatus;
	selectedFiles: TSelectedFilesState;
}

export interface IUploadFailureData {
	err: BaseError;
	failedFileDisplayName: string;
}

export interface IFileAction<T> {
	type: string;
	payload: T;
}

export interface IProcessFilesAction extends IFileAction<TSelectedFilesState> {
	type: 'PROCESS_FILES';
}

export interface IFilesSelectedAction
	extends IFileAction<TPreprocessingResults> {
	type: 'FILES_SELECTED';
}

export interface IUnselectFileAction extends IFileAction<string> {
	type: 'UNSELECT_FILE';
}

export interface IInvalidFileSelectionAction
	extends IFileAction<TPreprocessErrors> {
	type: 'INVALID_FILE_SELECTIONS';
}

export interface IUpdateFileAction extends IFileAction<Partial<IImage>> {
	type: 'UPDATE_FILE';
	previousName: string;
}

export interface IUnselectAllAction extends IFileAction<null> {
	type: 'UNSELECT_ALL';
}

export interface IInitUploadAction extends IFileAction<string> {
	type: 'INIT_UPLOAD';
}

export interface IImagesEmittedAction extends IFileAction<IResizingData> {
	type: 'IMAGES_EMITTED';
}

export interface IUploadSuccessAction extends IFileAction<string> {
	type: 'UPLOAD_SUCCESS';
}

export interface IUploadFailedAction extends IFileAction<IUploadFailureData> {
	type: 'UPLOAD_FAILED';
}

export interface IUploadComponentErr extends IFileAction<string> {
	type: 'UPLOAD_COMPONENT_ERR';
}

export type TUploaderActions =
	| IProcessFilesAction
	| IFilesSelectedAction
	| IInvalidFileSelectionAction
	| IUpdateFileAction
	| IUnselectAllAction
	| IUnselectFileAction
	| IUploadFailedAction
	| IUploadSuccessAction
	| IImagesEmittedAction
	| IInitUploadAction
	| IUploadComponentErr;
