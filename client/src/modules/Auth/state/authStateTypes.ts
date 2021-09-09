import {
	IUserProfilePreferences,
	TAuthorizedUserResponse,
} from 'sharedTypes/User';
import { BaseError } from '../../../core/error';

export type TMessageSeverity = 'error' | 'warning' | 'info' | 'success';

export type TMessageActionKind = 'simple' | 'advanced';

export interface IMessageHandlerSpec {
	buttonText: string;
	handler: (...args: any[]) => void;
}

export interface IAdvancedMessageAction {
	kind: 'advanced';
	proceed: IMessageHandlerSpec;
	abort: IMessageHandlerSpec;
}

export interface ISimpleMessageAction {
	kind: 'simple';
	handler: (...args: any[]) => void;
}

export type TMessageKind = 'singleNotice' | 'repeat';

export interface IAppMessage {
	messageKind: TMessageKind;
	eventName: string;
	displayMessage: string;
	severity: TMessageSeverity;
	action: IAdvancedMessageAction | ISimpleMessageAction;
	timeout?: number;
	displayTrackingProp?: keyof IDisplayTrackingProps;
}

export type TSingleNoticeMessage = IAppMessage & {
	messageKind: 'singleNotice';
	displayTrackingProp: keyof IDisplayTrackingProps;
};

export type TAppErrors = BaseError[];

export type TUserState = TAuthorizedUserResponse | null;

export type TAppMessageState = IAppMessage | null;

// NB: display tracking props are not persisted
// with the user's data--they will be re-triggered
// every time user logs into app
export interface IDisplayTrackingProps {
	demoMessageViewed: boolean;
}

export interface IAuthState extends IDisplayTrackingProps {
	user: TUserState;
	errors: TAppErrors;
	appMessage: TAppMessageState;
}

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
}

export type TAuthActions =
	| IRemoveAppMessage
	| IAddAppMessageAction
	| IUpdateProfileAction
	| IAddAuthErrAction
	| ILogoutUserAction
	| IAddUserAction
	| IInitAuthRequestAction;
