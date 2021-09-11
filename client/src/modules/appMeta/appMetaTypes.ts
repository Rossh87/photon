// NB: display tracking props are not persisted
// with the user's data--they will be re-triggered
// every time user logs into app
export interface IDisplayTrackingProps {
	demoMessageViewed: boolean;
}

export type TAppMetaState = IDisplayTrackingProps & {
	appMessage: IAppMessage | null;
};

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

export interface IAddAppMessageAction {
	type: 'META/ADD_APP_MESSAGE';
	payload: IAppMessage;
}

export interface IRemoveAppMessageAction {
	type: 'META/REMOVE_APP_MESSAGE';
}

export type TAppMetaActions = IAddAppMessageAction | IRemoveAppMessageAction;
