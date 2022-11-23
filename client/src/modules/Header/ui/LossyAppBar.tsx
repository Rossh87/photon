import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Hidden from '@mui/material/Hidden';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { useHistory } from 'react-router';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Option';
import { TAuthorizedUserResponse } from '../../../../../sharedTypes/User';
import { getProfileURL } from '../helpers';
import { useAppDispatch, useAppState } from '../../appState/useAppState';
import RouterLink from '../../RouterLink';
import Badge from './Badge';
import apiRoot from '../../../core/apiRoot';

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
			.get(`${apiRoot}/auth/logout`, { withCredentials: true })
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

	const handleClose: React.MouseEventHandler = (e) => {
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
				<Hidden mdDown>
					<Badge />
				</Hidden>
				<Hidden mdUp>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={onDrawerToggle}
						edge="start"
						size="large"
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
				<Hidden smDown>
					<Tooltip title="Alerts • No alerts">
						<IconButton color="inherit" size="large">
							<NotificationsIcon />
						</IconButton>
					</Tooltip>
					<IconButton
						color="inherit"
						className={classes.iconButtonAvatar}
						ref={menuRef}
						onClick={handleToggle}
						size="large"
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
										//   @todo: fix this handler type
										// @ts-ignore
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
