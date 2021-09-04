import * as React from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Container, Grid, Paper } from '@material-ui/core';
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
import { findLastIndex } from 'fp-ts/lib/Array';

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
		display: 'flex',
		flexDirection: 'column',
	},

	drawer: {
		display: 'grid',
		alignContent: 'center',
		width: '250px',
	},

	drawerPaperProps: {
		backgroundColor: 'rgba(0,0,0,0)',
	},

	paper: {
		padding: theme.spacing(2),
		height: '80vh',
	},

	contentGrid: {
		width: '100%',
		flexGrow: 1,
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
							borderRadius: '10px',
						},
					}}
					variant="permanent"
					open={drawerOpen}
					onClose={() => setDrawerOpen(false)}
					setDrawerOpen={setDrawerOpen}
				/>
			</nav>

			<Header onDrawerToggle={handleDrawerToggle} />
			<Container component="main" maxWidth="md">
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
			</Container>
		</ThemeProvider>
	);
};

export default Main;
