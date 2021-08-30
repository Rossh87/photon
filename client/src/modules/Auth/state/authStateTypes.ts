import { TUserState, IAuthorizedUserResponse } from '../domain/authDomainTypes';
import { AuthError } from '../domain/AuthError';

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
	payload: T;
}

export interface IAddUserAction extends IAuthAction<IAuthorizedUserResponse> {
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
