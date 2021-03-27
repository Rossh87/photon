import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import {
	TPreprocessErrors,
	IPreprocessedFile,
	TPreprocessingResults,
} from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';

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
	selectedFiles: TPreprocessingResults | [];
	errors: any;
}

export interface IFileAction<T> {
	type: string;
	data: T;
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

export interface IUpdateFileAction
	extends IFileAction<Partial<IPreprocessedFile>> {
	type: 'UPDATE_FILE';
	previousName: string;
}

export interface IUnselectAllAction extends IFileAction<null> {
	type: 'UNSELECT_ALL';
}

export type TPreprocessActions =
	| IFilesSelectedAction
	| IInvalidFileSelectionAction
	| IUpdateFileAction
	| IUnselectAllAction
	| IUnselectFileAction;
