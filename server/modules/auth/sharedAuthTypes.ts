import { AxiosInstance } from 'axios';
import { Either } from 'fp-ts/lib/Either';

// Begin OAuth flow types
export type TOAuthAccessToken = string;

export type TOAuthDataResponse = IGoogleOAuthResponse;

export interface IGoogleOAuthResponse {
    resourceName: string;
    etag: string;
    names: Array<IGoogleNamesObject>;
    emailAddresses: Array<IGoogleEmailsObject>;
    photos: Array<IGooglePhotosObject>;
}

interface IGoogleNamesObject {
    metadata: IGoogleMetadataObject;
    displayName: string;
    familyName: string;
    givenName: string;
    displayNameLastFirst: string;
    unstructuredName: string;
}
interface IGoogleEmailsObject {
    metadata: IGoogleMetadataObject;
    value: string;
}

interface IGooglePhotosObject {
    url: string;
    metadata: IGoogleMetadataObject;
    primary: true;
}
interface IGoogleMetadataObject {
    primary: boolean;
    verified?: boolean;
    source: {
        type: string;
        id: string;
    };
}
// Begin function types
export interface IRequestLibrary extends AxiosInstance {}

export interface IOAuthDataNormalizer<T> {
    (data: T): IUser;
}
