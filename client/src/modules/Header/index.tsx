import Navigator from './ui/Navigator';
import LossyAppBar from './ui/LossyAppBar';
import { FunctionComponent, useState } from 'react';
import LoginBar from './ui/LoginBar';
import { useAppState } from '../appState/useAppState';
import { TFormMode } from '../Landing/sharedLandingTypes';

// TODO: this is hacky to make Header reusable between
// logged-in and logged-out states.
interface LoginBarProps {
	setLandingMode?: (a: TFormMode) => void;
	landingMode?: TFormMode;
}

const Header: FunctionComponent<LoginBarProps> = ({
	setLandingMode,
	landingMode,
}) => {
	const [drawerOpen, setDrawerOpen] = useState(false);

	const handleDrawerToggle = () => {
		console.log('click');
		setDrawerOpen(!drawerOpen);
	};

	const { user } = useAppState();

	return user ? (
		<>
			<Navigator
				setDrawerOpen={setDrawerOpen}
				drawerOpen={drawerOpen}
			></Navigator>
			<LossyAppBar onDrawerToggle={handleDrawerToggle}></LossyAppBar>
		</>
	) : (
		<LoginBar
			landingMode={landingMode ? landingMode : 'signin'}
			setLandingMode={setLandingMode ? setLandingMode : (a) => {}}
		/>
	);
};

export default Header;
