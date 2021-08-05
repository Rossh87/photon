import { BaseError } from '../../../core/error';
import {
    TPreprocessErrors,
    TPreprocessingResult,
    TPreprocessingResults,
    IResizingData,
    TPreprocessArgs,
    TUpdateDisplayNameArgs,
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

export type TSelectedFilesState = Array<TPreprocessingResult>;

export interface IImageUploadState {
    status: TImageUploadStateStatus;
    selectedFiles: TSelectedFilesState;
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
    type: 'PROCESS_FILES';
}

export interface IFilesChangedAction extends IFileAction<TPreprocessArgs> {
    type: 'FILES_CHANGED';
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

export interface IUpdateFileAction extends IFileAction<IUpdateFileData> {
    type: 'UPDATE_FILE';
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

export interface IUploadComponentErr extends IFileAction<BaseError> {
    type: 'UPLOAD_COMPONENT_ERR';
}

export interface IInitDisplayNameUpdateAction
    extends IFileAction<TUpdateDisplayNameArgs> {
    type: 'INIT_NAME_UPDATE';
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
    | IInitDisplayNameUpdateAction
    | IImagesEmittedAction
    | IInitUploadAction
    | IFilesChangedAction
    | IUploadComponentErr;
