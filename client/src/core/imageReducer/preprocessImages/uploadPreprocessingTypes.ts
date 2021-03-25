import { BaseError } from '../../../../core/error';
import { IFetcher } from '../../../../core/sharedTypes';
import * as E from 'fp-ts/lib/Either';
import { ImagePreprocessError } from './ImagePreprocessError';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { These } from 'fp-ts/lib/These';
import { Dispatch } from 'react';

export interface IPreprocessedFile extends File {
	humanReadableSize: string;
	ownerID: string;
	displayName: string;
	originalSizeInBytes: number;
}

export type TPreprocessedFiles = NonEmptyArray<IPreprocessedFile>;

export type TPreprocessErrors = NonEmptyArray<ImagePreprocessError>;

export type TPreProcessResult = These<TPreprocessErrors, TPreprocessedFiles>;

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

export interface IPreprocessDependencies {
	ownerID: string;
}
