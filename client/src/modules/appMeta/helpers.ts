import { Dispatch } from 'react';
import { BaseError } from '../../core/error';
import { TAppAction } from '../appState/appStateTypes';
import { TMessageSeverity } from './appMetaTypes';

export const createSuccessMessage = (d: Dispatch<TAppAction>) => {
	d({
		type: 'META/ADD_APP_MESSAGE',
		payload: {
			messageKind: 'repeat',
			eventName: 'success',
			displayMessage: 'success!',
			severity: 'success',
			action: {
				kind: 'simple',
				handler: () => d({ type: 'META/REMOVE_APP_MESSAGE' }),
			},
			timeout: 3000,
		},
	});
};

export const emitBasicErrMessage = (
	d: Dispatch<TAppAction>,
	err: BaseError,
	severity: TMessageSeverity
) => {
	d({
		type: 'META/ADD_APP_MESSAGE',
		payload: {
			messageKind: 'repeat',
			eventName: 'likely async failure',
			displayMessage: err.message,
			severity: severity,
			action: {
				kind: 'simple',
				handler: () => d({ type: 'META/REMOVE_APP_MESSAGE' }),
			},
			timeout: 3000,
		},
	});
};
