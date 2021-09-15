import React, { FunctionComponent } from 'react';
import { useAppState } from '../appState/useAppState';
import Header from '../Header';
import Main from '../Main';
import Login from '../Login';

const Content: FunctionComponent = (props) => {
	const { user } = useAppState();

	return user ? <Main /> : <Content />;
};

export default Content;
