import {
	IUserProfilePreferences,
	TAuthorizedUserResponse,
} from 'sharedTypes/User';
import { BaseError } from '../../../core/error';

export type TAppErrors = BaseError[];

export type TUserState = TAuthorizedUserResponse | null;

export interface IAuthAction<T> {
	type: string;
	payload: T;
}

export interface IAddUserAction extends IAuthAction<TAuthorizedUserResponse> {
	type: 'AUTH/ADD_USER';
}

export interface ILogoutUserAction {
	type: 'AUTH/LOGOUT_USER';
}

export interface IAddAuthErrAction extends IAuthAction<BaseError> {
	type: 'AUTH/ADD_AUTH_ERR';
}

export interface IInitAuthRequestAction extends IAuthAction<null> {
	type: 'AUTH/AUTH_REQUEST_INITIATED';
}

export interface IUpdateProfileAction {
	type: 'AUTH/UPDATE_PROFILE_ACTION';
	payload: IUserProfilePreferences;
}

export interface IIncreaseImageCountAction {
	type: 'AUTH/INCREASE_IMAGE_COUNT';
	payload: number;
}

export type TAuthActions =
	| IIncreaseImageCountAction
	| IUpdateProfileAction
	| IAddAuthErrAction
	| ILogoutUserAction
	| IAddUserAction
	| IInitAuthRequestAction;
