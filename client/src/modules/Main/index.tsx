import * as React from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Container, Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Hidden from '@material-ui/core/Hidden';
import Navigator from '../Navigator';
import Header from '../Header';
import theme from '../theme';
import Uploader from '../Uploader';
import ImageSearchPage from '../ImageSearch';
import Profile from '../Profile';
import AppMessages from '../AppMessages';

import { Switch, Route } from 'react-router-dom';

const drawerWidth = 256;

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
		padding: theme.spacing(1),
	},
	footer: {
		padding: theme.spacing(2),
		background: '#eaeff1',
	},
});

const Main: React.FunctionComponent = () => {
	const classes = useStyles();
	const [drawerOpen, setDrawerOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setDrawerOpen(!drawerOpen);
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<nav>
				<Navigator
					PaperProps={{ style: { width: drawerWidth } }}
					variant="temporary"
					open={drawerOpen}
					onClose={() => setDrawerOpen(false)}
					setDrawerOpen={setDrawerOpen}
				/>
			</nav>

			<Header onDrawerToggle={handleDrawerToggle} />
			<Container maxWidth="md" component="main" className={classes.app}>
				<Grid
					className={classes.mainGrid}
					container
					direction="column"
					spacing={2}
				>
					<Grid item>
						<AppMessages />
					</Grid>
					<Grid item>
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
					</Grid>
				</Grid>
			</Container>
		</ThemeProvider>
	);
};

export default Main;
