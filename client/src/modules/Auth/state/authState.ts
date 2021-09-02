import { IAuthState, TAuthActions } from './authStateTypes';
import { Reducer } from 'react';
import { TAuthorizedUserResponse } from '../../../../../sharedTypes/User';

export const defaultState: IAuthState = {
	user: null,
	errors: [],
	status: 'fresh',
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
	}
};
