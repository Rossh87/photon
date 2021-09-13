/**
 * Site design adapted from Material-UI's Paperbase theme,
 * https://material-ui.com/store/items/paperbase/
 *  */

import React from 'react';
import Landing from '../Landing';
import AuthManager from '../Auth';
import AppProvider from '../appState/useAppState';
import Header from '../Header';
import DependencyContext, {
	liveDependencies,
} from '../../core/dependencyContext';
import { BrowserRouter as Router } from 'react-router-dom';
import theme from '../theme';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import Content from '../Content';

const App: React.FunctionComponent = (props) => {
	return (
		<DependencyContext.Provider value={liveDependencies}>
			<AppProvider>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Router>
						<AuthManager>
							<Content />
						</AuthManager>
					</Router>
				</ThemeProvider>
			</AppProvider>
		</DependencyContext.Provider>
	);
};

export default App;
