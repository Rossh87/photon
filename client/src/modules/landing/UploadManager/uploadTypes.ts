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

export type IPreprocessedFiles = Array<IProcessedFile>;

export type TPreprocessError = NonEmptyArray<string>;

export type TPreprocessErrors = NonEmptyArray<string>;

export type TPreProcessResult = E.Either<TPreprocessErrors, IPreprocessedFiles>;

export interface IFileWithID extends File {
    owner: string;
}

export interface IImageUploadState {
    status: TImageUploadStateStatus;
    fileSelectionErrors: null | Array<BaseError>;
    fileUploadErrors: null | Array<BaseError>;
    rawFiles: FileList | null;
    processedFiles: IPreprocessedFiles;
}

export interface IFileAction<T> {
    type: string;
    data: T;
}

export interface IFilesSelectedAction extends IFileAction<FileList> {
    type: 'FILES_SELECTED';
}

export interface IUnselectFileAction extends IFileAction<string> {
    type: 'UNSELECT_FILE';
}

export interface IInvalidFileSelectionAction extends IFileAction<BaseError> {
    type: 'INVALID_FILE_SELECTION';
}

export type TFileActions =
    | IFilesSelectedAction
    | IUnselectFileAction
    | IInvalidFileSelectionAction;

export interface IUploadReaderDependencies {
    file: File;
    ownerID: string;
    fetcher: IFetcher;
}
