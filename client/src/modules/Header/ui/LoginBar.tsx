import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Badge from './Badge';
import { TFormMode } from '../../Landing/sharedLandingTypes';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const useStyles = makeStyles((theme: Theme) => ({
	secondaryBar: {
		zIndex: 0,
	},
	iconButtonAvatar: {
		width: theme.spacing(6),
		height: theme.spacing(6),
	},
	appbarGrid: {
		padding: theme.spacing(2),
	},

	headerButton: {
		color: theme.palette.common.white,
		fontWeight: theme.typography.fontWeightBold,
	},

	appbarCenter: {
		flexGrow: 1,
	},

	loginBar: {
		// backgroundColor: 'transparent',
	},
}));

interface LoginBarProps {
	landingMode: TFormMode;
	setLandingMode: (a: TFormMode) => void;
}

const Header: React.FunctionComponent<LoginBarProps> = ({
	setLandingMode,
	landingMode,
}) => {
	const classes = useStyles();

	const toggleMode = () =>
		setLandingMode(landingMode === 'signin' ? 'signup' : 'signin');
	return (
		<AppBar
			className={classes.loginBar}
			color="primary"
			position="sticky"
			elevation={0}
		>
			<Toolbar>
				<Badge />
				<Box flexGrow={1} />
				<Button
					className={classes.headerButton}
					size="large"
					onClick={toggleMode}
				>
					{landingMode === 'signin' ? 'back' : 'sign in'}
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
