import { IncomingMessage } from 'http';
import { nanoid } from 'nanoid';
import { ReactElement } from 'react';
import {
	IAppMessage,
	TAppMessages,
	TMessageSeverity,
} from '../Auth/state/authStateTypes';

// helper function is responsible for assigning ids
// to every app message in case future implementation makes
// relying on message order in state array unreliable.
export const createAppMessage = (
	message: string,
	severity: TMessageSeverity,
	allowMultiple: boolean,
	action?: ReactElement
): IAppMessage => ({
	severity,
	message,
	action,
	allowMultiple,
	id: nanoid(),
});

export const incomingMessageAlreadyPresent = (
	incomingMsg: IAppMessage,
	msgs: TAppMessages
): boolean =>
	msgs.some(
		(prevMsg) =>
			prevMsg.message === incomingMsg.message &&
			prevMsg.severity === incomingMsg.severity
	);

export const handleIncomingMessage = (
	incomingMsg: IAppMessage,
	msgs: TAppMessages
) =>
	incomingMsg.allowMultiple
		? [...msgs, incomingMsg]
		: incomingMessageAlreadyPresent(incomingMsg, msgs)
		? msgs
		: [...msgs, incomingMsg];
