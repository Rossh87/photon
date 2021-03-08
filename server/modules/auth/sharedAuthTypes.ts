import { AxiosInstance } from 'axios';
import { Either } from 'fp-ts/lib/Either';

// Begin OAuth flow types
export type TOAuthAccessToken = string;

export type TOAuthDataResponse = IGoogleOAuthResponse;

export type TGoogleOAuthSubData =
	| IGoogleEmailsObject
	| IGoogleMetadataObject
	| IGoogleNamesObject
	| IGooglePhotosObject;

export interface IGoogleOAuthResponse {
	resourceName: string;
	etag: string;
	names: Array<IGoogleNamesObject>;
	emailAddresses: Array<IGoogleEmailsObject>;
	photos: Array<IGooglePhotosObject>;
}

export interface IGoogleNamesObject {
	metadata: IGoogleMetadataObject;
	displayName: string;
	familyName: string;
	givenName: string;
	displayNameLastFirst: string;
	unstructuredName: string;
}
export interface IGoogleEmailsObject {
	metadata: IGoogleMetadataObject;
	value: string;
}

export interface IGooglePhotosObject {
	url: string;
	metadata: IGoogleMetadataObject;
	primary: true;
}
export interface IGoogleMetadataObject {
	primary: boolean;
	verified?: boolean;
	source: {
		type: string;
		id: string;
	};
}
// Begin function types
export interface IRequestLibrary extends AxiosInstance {}
