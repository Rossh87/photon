import { TUserState } from '../domain/authDomainTypes';
import {
	IUserProfilePreferences,
	TAuthorizedUserResponse,
} from 'sharedTypes/User';
import { AuthError } from '../domain/AuthError';
import { BaseError } from '../../../core/error';
import { ReactElement } from 'react';

export type TMessageSeverity = 'error' | 'warning' | 'info' | 'success';

// TODO: type other than 'demo' only exists for testing
// purposes ATM
export type TAppMessageKind = 'demo' | 'other';

export type TMessageID = string;

export interface IAppMessage {
	id: TMessageID;
	message: string;
	severity: TMessageSeverity;
	allowMultiple: boolean;
	action?: ReactElement;
	kind: TAppMessageKind;
}

export type TDemoModeMessage = IAppMessage & {
	kind: 'demo';
};

export type TAppErrors = BaseError[];

export type TAppMessages = IAppMessage[];

// NB: demoMessageViewed is not persisted
// with the user's data--it will be re-triggered
// every time user logs into app
export interface IAuthState {
	user: TUserState;
	errors: TAppErrors;
	status: TAuthStatus;
	appMessages: TAppMessages;
	demoMessageViewed: boolean;
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

export interface IAddAppMessageAction {
	type: 'ADD_APP_MESSAGE';
	payload: IAppMessage;
}

export interface IRemoveAppMessage {
	type: 'REMOVE_APP_MESSAGE';
	payload: string;
}

export type TAuthActions =
	| IRemoveAppMessage
	| IAddAppMessageAction
	| IUpdateProfileAction
	| IAddAuthErrAction
	| ILogoutUserAction
	| IAddUserAction
	| IInitAuthRequestAction;
