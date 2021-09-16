import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Badge from './Badge';
import { TFormMode } from '../../Landing/sharedLandingTypes';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import useTopDetection from '../../hooks/useTopDetection';
import clsx from 'clsx';

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
		color: 'inherit',
		fontWeight: theme.typography.fontWeightBold,
	},

	transitionFade: {
		transition: 'background-color 0.25s',
	},

	loginBarAnchored: {
		backgroundColor: alpha(theme.palette.primary.light, 0.1),
		color: theme.palette.primary.main,
	},

	loginBarScrolled: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
	},
}));

interface LoginBarProps {
	landingMode: TFormMode;
	setLandingMode: (a: TFormMode) => void;
}

const LoginBar: React.FunctionComponent<LoginBarProps> = ({
	setLandingMode,
	landingMode,
}) => {
	const isAtTop = useTopDetection();

	const classes = useStyles();

	const toggleMode = () =>
		setLandingMode(landingMode === 'signin' ? 'signup' : 'signin');

	const barClasses = clsx(
		isAtTop ? classes.loginBarAnchored : classes.loginBarScrolled,
		classes.transitionFade
	);

	return (
		<AppBar
			className={barClasses}
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

export default LoginBar;
