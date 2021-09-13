import React, { FunctionComponent } from 'react';
import { useAppState } from '../appState/useAppState';
import Header from '../Header';
import Main from '../Main';
import Login from '../Login';

const Content: FunctionComponent = (props) => {
	const { user } = useAppState();

	const renderContent = () => (user ? <Main /> : <Login />);

	return (
		<>
			<Header />
			{renderContent()}
		</>
	);
};

export default Content;
