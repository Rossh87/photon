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
import Badge from './Badge';

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
}));

interface HeaderProps {
	onDrawerToggle: () => void;
}

const LossyAppBar: React.FunctionComponent<HeaderProps> = ({
	onDrawerToggle,
}) => {
	const menuRef = React.useRef<HTMLButtonElement>(null);

	const classes = useStyles();

	const history = useHistory();

	const appState = useAppState();
	const appDispatch = useAppDispatch();

	const handleLogout = () => {
		axios
			.get('http://localhost:8000/auth/logout', { withCredentials: true })
			.then(() => appDispatch({ type: 'AUTH/LOGOUT_USER' }))
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
			appState.user as TAuthorizedUserResponse,
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
		<AppBar color="primary" position="sticky" elevation={0}>
			<Toolbar>
				<Hidden smDown>
					<Badge />
				</Hidden>
				<Hidden mdUp>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={onDrawerToggle}
						edge="start"
					>
						<MenuIcon />
					</IconButton>
				</Hidden>
				<Box flexGrow={1} />
				<Button
					className={classes.headerButton}
					onClick={handleLogout}
					size="large"
				>
					Logout
				</Button>
				<Hidden xsDown>
					<Tooltip title="Alerts • No alerts">
						<IconButton color="inherit">
							<NotificationsIcon />
						</IconButton>
					</Tooltip>
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
											onKeyDown={handleListKeyDown}
										>
											<RouterLink to="/profile">
												<MenuItem onClick={handleClose}>
													Profile
												</MenuItem>
											</RouterLink>
											<MenuItem onClick={handleLogout}>
												Logout
											</MenuItem>
										</MenuList>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
				</Hidden>
			</Toolbar>
		</AppBar>
	);
};

export default LossyAppBar;
