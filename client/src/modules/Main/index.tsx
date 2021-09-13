import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, useMediaQuery, Hidden } from '@material-ui/core';
import theme from '../theme';
import Uploader from '../Uploader';
import ImageSearchPage from '../ImageSearch';
import Profile from '../Profile';
import { useTheme } from '@material-ui/core/styles';
import AppMessage from '../AppMessage';
import { Switch, Route } from 'react-router-dom';

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

	return (
		<div>
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
							<Route path="/upload">
								<Uploader />
							</Route>
							<Route path="/image-search">
								<ImageSearchPage />
							</Route>
							<Route path="/profile">
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
		</div>
	);
};

export default Main;
