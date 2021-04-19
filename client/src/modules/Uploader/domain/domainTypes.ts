import { ImagePreprocessError } from './ImagePreprocessError';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { BaseError } from '../../../core/error';
import { IUploadRequestMetadata } from '../http/httpTypes';

export interface IImage extends File {
	humanReadableSize: string;
	ownerID: string;
	displayName: string;
	originalSizeInBytes: number;
	resizedImages?: IResizingData;
	error?: BaseError;
	status: 'preprocessed' | 'populated' | 'processing' | 'success' | 'error';
}

export interface IPreprocessDependencies {
	ownerID: string;
}

export interface IUploadableBlob {
	blob: Blob;
	metaData: IUploadRequestMetadata;
}

// TODO: redundant nesting here...
export interface IResizingData extends IImage {
	originalCanvas: HTMLCanvasElement;
	neededWidths: NonEmptyArray<number>;
	resizedBlobs: NonEmptyArray<IUploadableBlob>;
}

export type TPreprocessErrors = NonEmptyArray<ImagePreprocessError>;

export type TPreprocessingResults = NonEmptyArray<IImage>;
