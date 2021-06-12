import React, { useReducer } from 'react';
import { authReducer, defaultState } from './authState';
import { IAuthState, TAuthActions } from './authStateTypes';

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
export default AuthProvider;
