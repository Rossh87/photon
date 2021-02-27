import { AuthError } from './AuthErrors';

export interface IUser {
    OAuthProviderName: string;
    localAppID: string;
    thumbnailURL: string;
    displayName: string;
    familyName: string;
    givenName: string;
    emailAddress: boolean;
}

export type TUserState = IUser | null;

export interface IAuthState {
    user: TUserState;
    errors: AuthError[];
    status: TAuthStatus;
}

export type TAuthStatus =
    | 'fresh'
    | 'pending'
    | 'authorized'
    | 'loggedOut'
    | 'failed';

export interface IAuthAction<T> {
    type: string;
    data: T;
}

export interface IAddUserAction extends IAuthAction<IUser> {
    type: 'ADD_USER';
}

export interface ILogoutUserAction extends IAuthAction<null> {
    type: 'LOGOUT_USER';
}

export interface IAddAuthErrAction extends IAuthAction<AuthError> {
    type: 'ADD_AUTH_ERR';
}

export interface IInitAuthRequestAction extends IAuthAction<null> {
    type: 'AUTH_REQUEST_INITIATED';
}

export type TAuthActions =
    | IAddAuthErrAction
    | ILogoutUserAction
    | IAddUserAction
    | IInitAuthRequestAction;
