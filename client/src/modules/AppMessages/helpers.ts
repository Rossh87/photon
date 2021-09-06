import { pipe } from 'fp-ts/lib/function';
import { IncomingMessage } from 'http';
import { nanoid } from 'nanoid';
import { ReactElement } from 'react';
import { fold } from 'fp-ts/boolean';
import {
	IAppMessage,
	IAuthState,
	TAppMessageKind,
	TAppMessages,
	TDemoModeMessage,
	TMessageSeverity,
} from '../Auth/state/authStateTypes';

// helper function is responsible for assigning ids
// to every app message in case future implementation makes
// relying on message order in state array unreliable.
export const createAppMessage = (
	message: string,
	severity: TMessageSeverity,
	allowMultiple: boolean,
	kind: TAppMessageKind,
	action?: ReactElement
): IAppMessage => ({
	severity,
	message,
	action,
	allowMultiple,
	kind,
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

export const manageDuplicateMessages = (
	incomingMsg: IAppMessage,
	msgs: TAppMessages
) =>
	incomingMsg.allowMultiple
		? [...msgs, incomingMsg]
		: incomingMessageAlreadyPresent(incomingMsg, msgs)
		? msgs
		: [...msgs, incomingMsg];

// Deal with setting demo-mode viewed state
// if incoming message is demo-related.
// Otherwise, kick it to the duplicate manager.
export const handleIncomingMessage = (
	currState: IAuthState,
	message: IAppMessage
): IAuthState =>
	pipe(
		message,
		isDemoMessage,
		fold(
			() => ({
				...currState,
				appMessages: manageDuplicateMessages(
					message,
					currState.appMessages
				),
			}),
			() =>
				pipe(
					currState.demoMessageViewed,
					fold(
						() => ({
							...currState,
							demoMessageViewed: true,
							appMessages: manageDuplicateMessages(
								message,
								currState.appMessages
							),
						}),
						() => currState
					)
				)
		)
	);

export const isDemoMessage = (msg: IAppMessage): msg is TDemoModeMessage =>
	msg.kind === 'demo';
