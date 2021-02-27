import { WithId } from 'mongodb';

type TOAuthProvider = 'google';

export interface IUser extends Record<string, any> {
    OAuthProviderName: TOAuthProvider;
    OAuthProviderID: string;
    thumbnailURL: string;
    displayName: string;
    familyName: string;
    givenName: string;
    OAuthEmail: string;
    OAuthEmailVerified: boolean;
    preferredEmail?: string;
    preferredVerified?: boolean;
}

export interface IDBUser extends WithId<IUser> {}

export interface IAuthorizedUserResponse extends Record<string, any> {
    OAuthProviderName: TOAuthProvider;
    _id: string;
    thumbnailURL: string;
    displayName: string;
    familyName: string;
    givenName: string;
    emailAddress: string;
}
