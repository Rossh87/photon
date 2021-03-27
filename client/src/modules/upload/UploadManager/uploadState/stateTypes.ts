import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import {
	TPreprocessedFiles,
	TPreprocessErrors,
	IPreprocessedFile,
} from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
import { TImageReducerErrors } from '../../../../core/imageReducer/resizeImage/imageReducerTypes';

// Begin image preprocessing types
export type TFilesArray = NonEmptyArray<File>;

export type TImageUploadStateStatus =
	| 'awaitingFileSelection'
	| 'validatingSelectedFiles'
	| 'preparingFilesForUpload'
	| 'uploading'
	| 'success'
	| 'failed';

export interface IImageUploadState {
	status: TImageUploadStateStatus;
	selectedFiles: TPreprocessedFiles | [];
	errors: TPreprocessErrors | TImageReducerErrors | [];
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

export type TPreprocessActions =
	| IFilesSelectedAction
	| IUnselectValidFileAction
	| IUnselectInvalidFileAction
	| IInvalidFileSelectionAction
	| IUpdateFileAction;
