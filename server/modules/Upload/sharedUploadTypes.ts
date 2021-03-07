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
	uploadURI: string;
}

export type TRequestedUploads = NonEmptyArray<IUploadRequestMetadata>;
