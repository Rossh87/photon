import { Reducer } from 'react';
import { ILogoutUserAction, TAuthActions } from '../Auth/state/authStateTypes';
import { TAppMetaActions, TAppMetaState } from './appMetaTypes';
import { handleIncomingMessage } from './handleIncomingMessage';

export const defaultState: TAppMetaState = {
	appMessage: null,
	demoMessageViewed: false,
};

export const appMetaReducer: Reducer<
	TAppMetaState,
	TAppMetaActions | ILogoutUserAction
> = (state, action) => {
	switch (action.type) {
		case 'AUTH/LOGOUT_USER':
			return { ...defaultState };

		case 'META/ADD_APP_MESSAGE':
			return handleIncomingMessage(state, action.payload);

		case 'META/REMOVE_APP_MESSAGE':
			return {
				...state,
				appMessage: null,
			};
		default:
			return state;
	}
};
