import React, { Dispatch, useReducer } from 'react';
import { BaseError } from '../../../core/error';
import { authReducer, defaultState } from './authState';
import {
	IAdvancedMessageAction,
	IAppMessage,
	IAuthState,
	ISimpleMessageAction,
	TAuthActions,
	TMessageSeverity,
} from './authStateTypes';

// We cast the context types because we need to initialize them *outside* of the component
// to be able to provide the contexts in separate hooks
export const AuthStateContext: React.Context<IAuthState> =
	React.createContext(defaultState);
export const AuthDispatchContext: React.Context<React.Dispatch<TAuthActions>> =
	React.createContext(
		((a: TAuthActions) => null) as React.Dispatch<TAuthActions>
	);

const AuthProvider: React.FunctionComponent = ({ children }) => {
	const [authState, authDispatch] = useReducer(authReducer, defaultState);

	return (
		<AuthDispatchContext.Provider value={authDispatch}>
			<AuthStateContext.Provider value={authState}>
				{children}
			</AuthStateContext.Provider>
		</AuthDispatchContext.Provider>
	);
};

export const useAuthDispatch = () => React.useContext(AuthDispatchContext);
export const useAuthState = () => React.useContext(AuthStateContext);
export const useAuthMessage = () => {
	const dispatch = React.useContext(AuthDispatchContext);

	return (msg: IAppMessage) => {
		dispatch({ type: 'ADD_APP_MESSAGE', payload: msg });

		return () => dispatch({ type: 'REMOVE_APP_MESSAGE' });
	};
};
export const createSuccessMessage = (d: Dispatch<TAuthActions>) => {
	d({
		type: 'ADD_APP_MESSAGE',
		payload: {
			messageKind: 'repeat',
			eventName: 'success',
			displayMessage: 'success!',
			severity: 'success',
			action: {
				kind: 'simple',
				handler: () => d({ type: 'REMOVE_APP_MESSAGE' }),
			},
			timeout: 3000,
		},
	});
};

export const emitBasicErrMessage = (
	d: Dispatch<TAuthActions>,
	err: BaseError,
	severity: TMessageSeverity
) => {
	console.log('emitting');
	d({
		type: 'ADD_APP_MESSAGE',
		payload: {
			messageKind: 'repeat',
			eventName: 'likely async failure',
			displayMessage: err.message,
			severity: severity,
			action: {
				kind: 'simple',
				handler: () => d({ type: 'REMOVE_APP_MESSAGE' }),
			},
			timeout: 3000,
		},
	});
};

export default AuthProvider;
