import { NonEmptyArray } from 'fp-ts/NonEmptyArray';
import { ISavedBreakpoint, TUserBreakpoint } from './Breakpoint';
import { ResumableUploadCreationErr } from 'server/modules/Upload/helpers/requestResumableUpload';

export type TMediaType = 'image/jpeg' | 'image/png';

export type TPrimaryColor = string;

export type TAvailableImageWidths = NonEmptyArray<number>;

export interface ICombinedUploadRequestMetadata {
	ownerID: string;
	displayName: string;
	mediaType: TMediaType;
	sizeInBytes: number;
	integrityHash: NonEmptyArray<string>;
	primaryColor?: TPrimaryColor;
	availableWidths: TAvailableImageWidths;
	publicPathPrefix: string;
}

export interface IDBUpload
	extends ICombinedUploadRequestMetadata,
		Record<string, any> {
	_id: string;
	breakPoints: ISavedBreakpoint[];
}

export interface IUploadRequestMetadata extends Record<string, any> {
	ownerID: string;
	displayName: string;
	mediaType: TMediaType;
	sizeInBytes: number;
	integrityHash: string;
	primaryColor?: string;
	width: number;
}

export interface IUploadsRequestPayload {
	uploadRequests: NonEmptyArray<IUploadRequestMetadata>;
}

// TODO: don't love this interdependency with server module, but...
export interface IUploadsResponsePayload {
	successes?: NonEmptyArray<IUploadURIMetadata>;
	failures?: NonEmptyArray<ResumableUploadCreationErr>;
}

export interface IUploadURIMetadata extends IUploadRequestMetadata {
	resumableURI: string;
	uploadSessionIsOpen: boolean;
	ok: true;
}

export type TWithoutID<T> = Omit<T, '_id'>;
