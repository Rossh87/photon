import React, { useEffect } from 'react';
import { fetchUserData } from './http/fetchUserData';
import { useAppDispatch } from '../appState/useAppState';
const AuthManager: React.FunctionComponent = ({ children }) => {
	const appDispatch = useAppDispatch();

	useEffect(() => {
		fetchUserData(appDispatch);
	}, []);

	return <div>{children}</div>;
};

export default AuthManager;
