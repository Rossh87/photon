import * as React from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Hidden from '@material-ui/core/Hidden';
import Navigator from '../Navigator';
import Header from '../Header';
import theme from '../theme';
import Uploader from '../Uploader';
import ImageSearchPage from '../ImageSearch';
import Profile from '../Profile';

import { Switch, Route } from 'react-router-dom';

const drawerWidth = 256;

const useStyles = makeStyles({
	root: {
		display: 'flex',
		minHeight: '100vh',
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	app: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
	},
	main: {
		flex: 1,
		padding: theme.spacing(6, 4),
		background: '#eaeff1',
	},
	footer: {
		padding: theme.spacing(2),
		background: '#eaeff1',
	},
});

const Main: React.FunctionComponent = () => {
	const classes = useStyles();
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	return (
		<ThemeProvider theme={theme}>
			<div className={classes.root}>
				<CssBaseline />
				<nav className={classes.drawer}>
					<Hidden xsUp implementation="js">
						<Navigator
							PaperProps={{ style: { width: drawerWidth } }}
							variant="temporary"
							open={mobileOpen}
							onClose={handleDrawerToggle}
						/>
					</Hidden>
					<Hidden smDown implementation="css">
						<Navigator
							PaperProps={{ style: { width: drawerWidth } }}
						/>
					</Hidden>
				</nav>

				<div className={classes.app}>
					<Header onDrawerToggle={handleDrawerToggle} />
					<Alert severity="info">
						Photon is currently running in demo mode.
					</Alert>
					<main className={classes.main}>
						<Switch>
							<Route path="/upload">
								<Uploader />
							</Route>
							<Route path="/imagesearch">
								<ImageSearchPage />
							</Route>
							<Route path="/profile">
								<Profile />
							</Route>
						</Switch>
					</main>
					<footer className={classes.footer}></footer>
				</div>
			</div>
		</ThemeProvider>
	);
};

export default Main;
