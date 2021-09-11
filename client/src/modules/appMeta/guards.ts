import {
	IAdvancedMessageAction,
	IAppMessage,
	ISimpleMessageAction,
	TSingleNoticeMessage,
} from './appMetaTypes';

export const isAdvancedMessageAction = (
	a: IAdvancedMessageAction | ISimpleMessageAction
): a is IAdvancedMessageAction => a.kind === 'advanced';

export const isSingleNoticeMessage = (
	a: IAppMessage
): a is TSingleNoticeMessage => a.messageKind === 'singleNotice';
