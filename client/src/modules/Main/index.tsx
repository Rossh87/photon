import * as React from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import {
	CssBaseline,
	Container,
	Grid,
	Paper,
	Box,
	useMediaQuery,
	Hidden,
} from '@material-ui/core';
import clsx from 'clsx';
import Navigator from '../Navigator';
import Header from '../Header';
import theme from '../theme';
import Uploader from '../Uploader';
import ImageSearchPage from '../ImageSearch';
import Profile from '../Profile';
import AppMessages from '../AppMessages';
import { useTheme } from '@material-ui/core/styles';
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
	const [drawerOpen, setDrawerOpen] = React.useState(false);

	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));

	const handleDrawerToggle = () => {
		console.log('toggle');
		setDrawerOpen(!drawerOpen);
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<nav>
				<Navigator
					PaperProps={{
						style: {
							boxShadow:
								'0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
							backgroundColor: 'white',
							border: 'none',
							width: '100px',
							height: '350px',
							marginTop: '157px',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'space-around',
							marginLeft: '1vw',
							marginRight: '5vw',
							borderRadius: '10px',
						},
					}}
					open={drawerOpen}
					onClose={() => setDrawerOpen(false)}
					setDrawerOpen={setDrawerOpen}
				/>
			</nav>

			<Header onDrawerToggle={handleDrawerToggle} />
			{/* <Container
				component="main"
				maxWidth="lg"
				className={matches ? classes.containerWithDrawer : ''}
				fixed
			> */}
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
					<AppMessages />
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
			{/* </Container> */}
		</ThemeProvider>
	);
};

export default Main;
