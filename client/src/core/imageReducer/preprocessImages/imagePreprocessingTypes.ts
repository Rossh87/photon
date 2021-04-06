import { ImagePreprocessError } from './ImagePreprocessError';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { IResizingData } from '../resizeImage/imageReducerTypes';
import { BaseError } from '../../../core/error';

export interface IPreprocessedFile extends File {
	humanReadableSize: string;
	ownerID: string;
	displayName: string;
	originalSizeInBytes: number;
	resizedImages?: IResizingData;
	error?: BaseError;
	status: 'preprocessed' | 'populated' | 'uploading' | 'success' | 'error';
}

export type TPreprocessedFiles = NonEmptyArray<IPreprocessedFile>;

export type TPreprocessErrors = NonEmptyArray<ImagePreprocessError>;

export type TPreprocessingResults = NonEmptyArray<IPreprocessedFile>;

export interface IPreprocessDependencies {
	ownerID: string;
}
