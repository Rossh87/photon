import { AxiosInstance } from 'axios';
import { Request } from 'express';
import { Either } from 'ts-result';

export type TUserRole = 'uploader' | 'admin' | 'tourist';

// End User-related types

// Begin OAuth flow types
type TOAuthAccessToken = string;

type TOAuthDataResponse = IGoogleOAuthResponse;

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

export interface IAccessTokenExtractor {
    (req: Request): Either<Error, TOAuthAccessToken>;
}

export interface IOAuthDataRequestor<A, B, E extends Error = Error> {
    (requestLibrary: A): (token: TOAuthAccessToken) => Promise<Either<E, B>>;
}

export interface IOAuthDataNormalizer<T> {
    (data: T): IUser;
}
