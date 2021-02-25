export interface IUser {
    OAuthProviderName: string;
    localAppID: string;
    thumbnailURL: string;
    displayName: string;
    familyName: string;
    givenName: string;
    emailAddress: boolean;
}

export interface IDefaultState {
    user: TBlankUser;
    errors: [];
}

export type TBlankUser = { [k in keyof IUser]: null };
