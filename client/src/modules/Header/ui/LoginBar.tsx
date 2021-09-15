import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Box from '@material-ui/core/Box';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { makeStyles, Theme } from '@material-ui/core/styles';
import axios from 'axios';
import { useHistory } from 'react-router';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Option';
import { TAuthorizedUserResponse } from '../../../../../sharedTypes/User';
import { getProfileURL } from '../helpers';
import { useAppDispatch, useAppState } from '../../appState/useAppState';
import RouterLink from '../../RouterLink';

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
		backgroundColor: 'transparent',
	},
}));

const Header: React.FunctionComponent = (props) => {
	const classes = useStyles();

	return (
		<AppBar
			className={classes.loginBar}
			color="primary"
			position="sticky"
			elevation={0}
		>
			<Toolbar>
				<Box flexGrow={1} />
				<Button className={classes.headerButton} size="large">
					Login
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
