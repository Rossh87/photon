import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export interface IUploadRequestMetadata {
	ownerID: string;
	sizeInBytes: number;
	displayName: string;
	uploadPath: string;
	integrityHash: string;
	primaryColor: string;
	mediaType: string;
}

export interface IUploadResponseMetadata extends IUploadRequestMetadata {
	resumableURI: string;
	uploadSessionIsOpen: boolean;
	ok: true;
}

export type TRequestedUploads = NonEmptyArray<IUploadRequestMetadata>;
