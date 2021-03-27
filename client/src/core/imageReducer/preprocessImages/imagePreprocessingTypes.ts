import { ImagePreprocessError } from './ImagePreprocessError';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export interface IPreprocessedFile extends File {
	humanReadableSize: string;
	ownerID: string;
	displayName: string;
	originalSizeInBytes: number;
}

export interface IPreprocessingResult {
	imageData?: IPreprocessedFile;
	error?: ImagePreprocessError;
}

export type TPreprocessedFiles = NonEmptyArray<IPreprocessedFile>;

export type TPreprocessErrors = NonEmptyArray<ImagePreprocessError>;

export interface IPreprocessDependencies {
	ownerID: string;
}
