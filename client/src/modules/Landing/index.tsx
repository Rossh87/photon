import React from 'react';
import { useAppState } from '../appState/useAppState';
import { TUserState } from '../Auth/state/authStateTypes';
import Login from '../Login';
import Main from '../Main';

const Landing: React.FunctionComponent = () => {
	const appState = useAppState();

	const renderChild: (u: TUserState) => React.ReactElement = (u) =>
		u ? <Main /> : <Login />;

	return <React.Fragment>{renderChild(appState.user)}</React.Fragment>;
};

export default Landing;
