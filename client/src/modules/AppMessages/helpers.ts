import { nanoid } from 'nanoid';
import { ReactElement } from 'react';
import { IAppMessage, TMessageSeverity } from '../Auth/state/authStateTypes';

// helper function is responsible for assigning ids
// to every app message in case future implementation makes
// relying on message order in state array unreliable.
export const createAppMessage = (
	message: string,
	severity: TMessageSeverity,
	action?: ReactElement
): IAppMessage => ({
	severity,
	message,
	action,
	id: nanoid(),
});
