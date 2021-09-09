import React from 'react';
import Login from '../Login';
import { useAuthState } from '../Auth/state/useAuthState';
import Main from '../Main';
import { TUserState } from '../Auth/state/authStateTypes';

const Landing: React.FunctionComponent = () => {
	const authState = useAuthState();

	const renderChild: (u: TUserState) => React.ReactElement = (u) =>
		u ? <Main /> : <Login />;

	return <React.Fragment>{renderChild(authState.user)}</React.Fragment>;
};

export default Landing;
