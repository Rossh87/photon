import { TUserState } from '../domain/authDomainTypes';
import {
	IUserProfilePreferences,
	TAuthorizedUserResponse,
} from 'sharedTypes/User';
import { AuthError } from '../domain/AuthError';
import { BaseError } from '../../../core/error';

export interface IAuthState {
	user: TUserState;
	errors: BaseError[];
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

export interface IAddUserAction extends IAuthAction<TAuthorizedUserResponse> {
	type: 'ADD_USER';
}

export interface ILogoutUserAction {
	type: 'LOGOUT_USER';
}

export interface IAddAuthErrAction extends IAuthAction<BaseError> {
	type: 'ADD_AUTH_ERR';
}

export interface IInitAuthRequestAction extends IAuthAction<null> {
	type: 'AUTH_REQUEST_INITIATED';
}

export interface IUpdateProfileAction {
	type: 'UPDATE_PROFILE_ACTION';
	payload: IUserProfilePreferences;
}

export type TAuthActions =
	| IUpdateProfileAction
	| IAddAuthErrAction
	| ILogoutUserAction
	| IAddUserAction
	| IInitAuthRequestAction;
