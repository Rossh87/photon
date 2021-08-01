import { ImagePreprocessError } from './ImagePreprocessError';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { BaseError } from '../../../core/error';
import { IUploadRequestMetadata } from '../http/httpTypes';
import { Either } from 'fp-ts/lib/Either';

// TODO: IImage types still aren't quite right IMO--need to better
// distinguish between err and ok states.
interface IImageBaseProps extends File, Record<string, any> {
	humanReadableSize: string;
	ownerID: string;
	displayName: string;
	originalSizeInBytes: number;
	resizedImages?: IResizingData;
	isUniqueDisplayName: 'pending' | 'yes' | 'no';
}

export interface IImage extends IImageBaseProps {
	status: 'preprocessed';
}

export interface IImageWithErrors<T extends BaseError = BaseError>
	extends IImageBaseProps {
	status: 'error';
	error: T;
}

export type TAllUploadedImages = NonEmptyArray<
	Either<IImageWithErrors, IImage>
>;

export type TOwnerID = string;

export type TPreprocessArgs = [FileList, TOwnerID];

export type TNonEmptyPreprocessArgs = [NonEmptyArray<File>, TOwnerID];

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
