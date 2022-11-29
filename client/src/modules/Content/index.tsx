import { FunctionComponent } from 'react';
import { useAppState } from '../appState/useAppState';
import Main from '../Main';
import Landing from '../Landing';

const Content: FunctionComponent = () => {
	const { user } = useAppState();

	return user ? <Main /> : <Landing />;
};

export default Content;
