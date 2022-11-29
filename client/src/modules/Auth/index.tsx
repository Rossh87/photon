import React, { ReactElement, useEffect } from 'react';
import { fetchUserData } from './http/fetchUserData';
import { useAppDispatch } from '../appState/useAppState';

const AuthManager: React.FunctionComponent<{ children: ReactElement }> = ({
	children,
}) => {
	const appDispatch = useAppDispatch();

	useEffect(() => {
		fetchUserData(appDispatch);
	}, []);

	return <div>{children}</div>;
};

export default AuthManager;
