import { IAuthState, TAuthActions, IAppMessage } from './authStateTypes';
import { Reducer } from 'react';
import { TAuthorizedUserResponse } from 'sharedTypes/User';
import { handleIncomingMessage } from '../helpers/handleIncomingMessage';

export const defaultState: IAuthState = {
	user: null,
	errors: [],
	appMessage: null,
	// this can be false for all users, since
	// profile data handler checks the access level
	// of the user before dispatching the 'demo mode'
	// message.
	demoMessageViewed: false,
};

export const authReducer: Reducer<IAuthState, TAuthActions> = (
	state,
	action
) => {
	switch (action.type) {
		case 'ADD_USER':
			return { ...state, user: action.payload, status: 'authorized' };

		case 'LOGOUT_USER':
			return {
				...defaultState,
				user: null,
				status: 'loggedOut',
			};

		case 'ADD_AUTH_ERR':
			return {
				...state,
				errors: [...state.errors, action.payload],
				status: 'failed',
			};

		case 'UPDATE_PROFILE_ACTION':
			return {
				...state,
				user: {
					...(state.user as TAuthorizedUserResponse),
					userPreferences: action.payload,
				},
			};

		case 'AUTH_REQUEST_INITIATED':
			return { ...state, status: 'pending' };

		case 'ADD_APP_MESSAGE':
			return handleIncomingMessage(state, action.payload);

		case 'REMOVE_APP_MESSAGE':
			return {
				...state,
				appMessage: null,
			};
	}
};
