import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, useMediaQuery, Hidden } from '@material-ui/core';
import theme from '../theme';
import Uploader from '../Uploader';
import ImageSearchPage from '../ImageSearch';
import Profile from '../Profile';
import { useTheme } from '@material-ui/core/styles';
import AppMessage from '../AppMessage';
import { Switch, Route, useHistory } from 'react-router-dom';
import Header from '../Header';
import { useAppDispatch, useAppState } from '../appState/useAppState';
import WelcomeText from './ui/WelcomeText';
const drawerWidth = 180;

const useStyles = makeStyles({
	root: {
		display: 'flex',
		minHeight: '100vh',
	},

	app: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
	},

	mainGrid: {
		display: 'flex',
		flexWrap: 'nowrap',
	},

	marginGrid: {
		flex: `1 1 ${drawerWidth}px`,
	},

	drawer: {
		display: 'grid',
		alignContent: 'center',
		width: drawerWidth,
	},

	drawerPaperProps: {
		backgroundColor: 'rgba(0,0,0,0)',
	},

	paper: {
		padding: theme.spacing(2),
		marginTop: theme.spacing(2),
		minHeight: '80vh',
	},

	contentGrid: {
		flex: '0 1.5 1000px',
		maxWidth: '100vw',
	},

	mobileExpandedMargin: {
		flex: `1 3 ${drawerWidth}px`,
		minWidth: theme.spacing(1),
	},
});

const Main: React.FunctionComponent = () => {
	const classes = useStyles();

	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));

	const history = useHistory();
	const { appMeta } = useAppState();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!appMeta.demoMessageViewed) {
			dispatch({
				type: 'META/ADD_APP_MESSAGE',
				payload: {
					messageKind: 'singleNotice',
					eventName: 'display alpha mode message',
					displayMessage:
						'Lossy is currently running in alpha mode.  Users are limited to 10 uploads, and data persistence/availability is NOT GUARANTEED!',
					severity: 'warning',
					displayTrackingProp: 'demoMessageViewed',
					action: {
						kind: 'simple',
						handler: () =>
							dispatch({ type: 'META/REMOVE_APP_MESSAGE' }),
					},
				},
			});
		}
	});

	return (
		<>
			<Header />
			<Grid container className={classes.mainGrid}>
				<Hidden xsDown>
					<Grid
						item
						className={
							matches
								? classes.mobileExpandedMargin
								: classes.marginGrid
						}
					></Grid>
				</Hidden>
				<Grid item className={classes.contentGrid}>
					<AppMessage />
					<Paper className={classes.paper}>
						<Switch>
							<Route exact path="/">
								<WelcomeText />
							</Route>
							<Route exact path="/upload">
								<Uploader />
							</Route>
							<Route exact path="/image-search">
								<ImageSearchPage />
							</Route>
							<Route exact path="/profile">
								<Profile />
							</Route>
						</Switch>
					</Paper>
				</Grid>
				<Hidden xsDown>
					<Grid
						item
						className={
							matches
								? classes.mobileExpandedMargin
								: classes.marginGrid
						}
					></Grid>
				</Hidden>
			</Grid>
		</>
	);
};

export default Main;
