/**
 * Site design adapted from Material-UI's Paperbase theme,
 * https://material-ui.com/store/items/paperbase/
 *  */

import React from 'react';
import Landing from '../Landing';
import AuthManager from '../Auth';
import AppProvider from '../appState/useAppState';
import DependencyContext, {
	liveDependencies,
} from '../../core/dependencyContext';
import { BrowserRouter as Router } from 'react-router-dom';

const App: React.FunctionComponent = (props) => {
	return (
		<DependencyContext.Provider value={liveDependencies}>
			<AppProvider>
				<AuthManager>
					<Router>
						<Landing />
					</Router>
				</AuthManager>
			</AppProvider>
		</DependencyContext.Provider>
	);
};

export default App;
