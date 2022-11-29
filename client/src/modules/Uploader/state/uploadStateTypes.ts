import { BaseError } from '../../../core/error';
import {
	IResizingData,
	TPreprocessArgs,
	TPreprocessErrors,
	TPreprocessingResult,
	TPreprocessingResults,
	TUpdateDisplayNameArgs,
} from '../domain/domainTypes';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Option } from 'fp-ts/lib/Option';

export type TFilesArray = NonEmptyArray<File>;

export type TImageUploadStateStatus =
	| 'awaitingFileSelection'
	| 'validatingSelectedFiles'
	| 'preparingFilesForUpload'
	| 'uploading'
	| 'success'
	| 'failed';

export type TSelectedFilesState = Array<TPreprocessingResult>;

export interface IImageUploadState {
	status: TImageUploadStateStatus;
	selectedFiles: TSelectedFilesState;
	componentLevelError: Option<BaseError>;
}

export interface IUploadFailureData {
	err: BaseError;
	failedFileDisplayName: string;
}

export interface IUpdateFileData {
	prevName: string;
	updates: Partial<TPreprocessingResult>;
}

export interface IFileAction<T> {
	type: string;
	payload: T;
}

export interface IProcessFilesAction extends IFileAction<TSelectedFilesState> {
	type: 'UPLOADER/PROCESS_FILES';
}

export interface IFilesChangedAction extends IFileAction<TPreprocessArgs> {
	type: 'UPLOADER/FILES_CHANGED';
}

export interface IFilesSelectedAction
	extends IFileAction<TPreprocessingResults> {
	type: 'UPLOADER/FILES_SELECTED';
}

export interface IUnselectFileAction extends IFileAction<string> {
	type: 'UPLOADER/UNSELECT_FILE';
}

export interface IInvalidFileSelectionAction
	extends IFileAction<TPreprocessErrors> {
	type: 'UPLOADER/INVALID_FILE_SELECTIONS';
}

export interface IUpdateFileAction extends IFileAction<IUpdateFileData> {
	type: 'UPLOADER/UPDATE_FILE';
}

export interface IUnselectAllAction extends IFileAction<null> {
	type: 'UPLOADER/UNSELECT_ALL';
}

export interface IInitUploadAction extends IFileAction<string> {
	type: 'UPLOADER/INIT_UPLOAD';
}

export interface IImagesEmittedAction extends IFileAction<IResizingData> {
	type: 'UPLOADER/IMAGES_EMITTED';
}

export interface IUploadSuccessAction extends IFileAction<string> {
	type: 'UPLOADER/UPLOAD_SUCCESS';
}

export interface IUploadFailedAction extends IFileAction<IUploadFailureData> {
	type: 'UPLOADER/UPLOAD_FAILED';
}

export interface IUploadComponentErr extends IFileAction<BaseError> {
	type: 'UPLOADER/UPLOAD_COMPONENT_ERR';
}

export interface IInitDisplayNameUpdateAction
	extends IFileAction<TUpdateDisplayNameArgs> {
	type: 'UPLOADER/INIT_NAME_UPDATE';
}

export interface IClearComponentErrAction {
	type: 'UPLOADER/CLEAR_UPLOAD_COMPONENT_ERR';
}

export type TUploaderActions =
	| IClearComponentErrAction
	| IProcessFilesAction
	| IFilesSelectedAction
	| IInvalidFileSelectionAction
	| IUpdateFileAction
	| IUnselectAllAction
	| IUnselectFileAction
	| IUploadFailedAction
	| IUploadSuccessAction
	| IInitDisplayNameUpdateAction
	| IImagesEmittedAction
	| IInitUploadAction
	| IFilesChangedAction
	| IUploadComponentErr;
