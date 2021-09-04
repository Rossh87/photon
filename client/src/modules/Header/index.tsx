import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import RouterLink from '../RouterLink';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import {
	Button,
	ClickAwayListener,
	Grow,
	Menu,
	MenuItem,
	MenuList,
	Paper,
	Popper,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { makeStyles, Theme } from '@material-ui/core/styles';
import axios from 'axios';
import { useAuthDispatch, useAuthState } from '../Auth/state/useAuthState';
import { useHistory } from 'react-router';
import { pipe } from 'fp-ts/lib/function';
import { TAuthorizedUserResponse } from '../../../../sharedTypes/User';
import { getProfileURL } from './helpers';
import { fold } from 'fp-ts/Option';

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
}));

interface HeaderProps {
	onDrawerToggle: () => void;
}

const Header: React.FunctionComponent<HeaderProps> = ({ onDrawerToggle }) => {
	const menuRef = React.useRef<HTMLButtonElement>(null);

	const classes = useStyles();

	const history = useHistory();

	const authState = useAuthState();
	const authDispatch = useAuthDispatch();

	const handleLogout = () => {
		axios
			.get('http://localhost:8000/auth/logout', { withCredentials: true })
			.then(() => authDispatch({ type: 'LOGOUT_USER' }))
			.then(() => history.push('/'))
			.catch((e) => console.log(e));
	};

	const renderAvatar = (photoUrl: string) => (
		<Avatar className={classes.iconButtonAvatar} src={photoUrl} />
	);

	const renderPlaceholderIcon = () => (
		<AccountCircleIcon className={classes.iconButtonAvatar} />
	);

	const renderProfileImage = () =>
		pipe(
			authState.user as TAuthorizedUserResponse,
			getProfileURL,
			fold(renderPlaceholderIcon, renderAvatar)
		);

	// Popover menu stuff
	const [open, setOpen] = React.useState(false);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (e: React.MouseEvent<EventTarget>) => {
		if (
			menuRef.current &&
			menuRef.current!.contains(e.target as HTMLElement)
		) {
			return;
		}

		setOpen(false);
	};

	function handleListKeyDown(event: React.KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		}
	}

	const prevOpen = React.useRef(open);
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			menuRef.current!.focus();
		}

		prevOpen.current = open;
	}, [open]);

	return (
		<React.Fragment>
			<AppBar color="primary" position="sticky" elevation={0}>
				<Toolbar>
					<Grid
						container
						spacing={3}
						className={classes.appbarGrid}
						alignItems="center"
					>
						<Grid item>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={onDrawerToggle}
								edge="start"
							>
								<MenuIcon />
							</IconButton>
						</Grid>
						<Grid item xs />
						<Grid item>
							<Button
								className={classes.headerButton}
								onClick={handleLogout}
								size="large"
							>
								Logout
							</Button>
						</Grid>
						<Grid item>
							<Tooltip title="Alerts • No alerts">
								<IconButton color="inherit">
									<NotificationsIcon />
								</IconButton>
							</Tooltip>
						</Grid>
						<Grid item>
							<IconButton
								color="inherit"
								className={classes.iconButtonAvatar}
								ref={menuRef}
								onClick={handleToggle}
							>
								{renderProfileImage()}
							</IconButton>
							<Popper
								open={open}
								anchorEl={menuRef.current}
								role={undefined}
								transition
								disablePortal
							>
								{({ TransitionProps, placement }) => (
									<Grow
										{...TransitionProps}
										style={{
											transformOrigin:
												placement === 'bottom'
													? 'center top'
													: 'center bottom',
										}}
									>
										<Paper>
											<ClickAwayListener
												onClickAway={handleClose}
											>
												<MenuList
													autoFocusItem={open}
													id="menu-list-grow"
													onKeyDown={
														handleListKeyDown
													}
												>
													<RouterLink to="/profile">
														<MenuItem
															onClick={
																handleClose
															}
														>
															Profile
														</MenuItem>
													</RouterLink>
													<MenuItem
														onClick={handleLogout}
													>
														Logout
													</MenuItem>
												</MenuList>
											</ClickAwayListener>
										</Paper>
									</Grow>
								)}
							</Popper>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<AppBar
				component="div"
				className={classes.secondaryBar}
				color="primary"
				position="static"
				elevation={0}
			></AppBar>
		</React.Fragment>
	);
};

export default Header;
