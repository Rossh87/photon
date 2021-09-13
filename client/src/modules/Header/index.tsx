import Navigator from './ui/Navigator';
import LossyAppBar from './ui/LossyAppBar';
import { FunctionComponent, useState } from 'react';
import LoginBar from './ui/LoginBar';
import { useAppState } from '../appState/useAppState';

const Header: FunctionComponent = (props) => {
	const [drawerOpen, setDrawerOpen] = useState(false);

	const handleDrawerToggle = () => {
		setDrawerOpen(!drawerOpen);
	};

	const { user } = useAppState();

	return (
		<>
			<Navigator setDrawerOpen={setDrawerOpen}></Navigator>
			{user ? (
				<LossyAppBar onDrawerToggle={handleDrawerToggle}></LossyAppBar>
			) : (
				<LoginBar />
			)}
		</>
	);
};

export default Header;
