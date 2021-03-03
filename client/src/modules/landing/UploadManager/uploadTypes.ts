import { BaseError } from '../../../core/error';
import { IFetcher } from '../../../core/sharedTypes';
import * as E from 'fp-ts/lib/Either';
import { UploadError } from './UploadError';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

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
}

export type TPreprocessedFiles = NonEmptyArray<IProcessedFile>;

export type TPreprocessError = NonEmptyArray<string>;

export type TPreprocessErrors = NonEmptyArray<string>;

export type TPreProcessResult = E.Either<TPreprocessErrors, TPreprocessedFiles>;

export type TImageUploadErrorState = NonEmptyArray<string>;

export interface IImageUploadState {
    status: TImageUploadStateStatus;
    selectedFiles: TPreprocessedFiles | [];
    errors: TImageUploadErrorState | [];
}

export interface IFileAction<T> {
    type: string;
    data: T;
}

export interface IFilesSelectedAction extends IFileAction<TPreprocessedFiles> {
    type: 'FILES_SELECTED';
}

export interface IUnselectFileAction extends IFileAction<string> {
    type: 'UNSELECT_FILE';
}

export interface IInvalidFileSelectionAction
    extends IFileAction<TImageUploadErrorState> {
    type: 'INVALID_FILE_SELECTION';
}

export type TFileActions =
    | IFilesSelectedAction
    | IUnselectFileAction
    | IInvalidFileSelectionAction;

export interface IUploadReaderDependencies {
    ownerID: string;
}
