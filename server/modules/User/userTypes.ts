type TOAuthProvider = 'google';

export interface IUser {
    OAuthProviderName: TOAuthProvider;
    // we specify for possible future need
    OAuthProviderID: string;
    localAppID?: string;
    thumbnailURL: string;
    displayName: string;
    familyName: string;
    givenName: string;
    OAuthEmail: string;
    OAuthEmailVerified: boolean;
    // option for user to specify different email
    preferredEmail?: string;
    preferredVerified?: boolean;
}
