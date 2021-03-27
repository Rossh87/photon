import { ImagePreprocessError } from './ImagePreprocessError';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { These } from 'fp-ts/lib/These';

export interface IPreprocessedFile extends File {
	humanReadableSize: string;
	ownerID: string;
	displayName: string;
	originalSizeInBytes: number;
}

export type TPreprocessedFiles = NonEmptyArray<IPreprocessedFile>;

export type TPreprocessErrors = NonEmptyArray<ImagePreprocessError>;

export type TPreProcessResult = These<TPreprocessErrors, TPreprocessedFiles>;

export interface IPreprocessDependencies {
	ownerID: string;
}
