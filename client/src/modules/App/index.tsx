/**
 * Site design adapted from Material-UI's Paperbase theme,
 * https://material-ui.com/store/items/paperbase/
 *  */

import AuthManager from '../Auth';
import AppProvider from '../appState/useAppState';
import DependencyContext, {
	liveDependencies,
} from '../../core/dependencyContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Content from '../Content';

const App: React.FunctionComponent = (props) => {
	return (
		<CssBaseline>
			<DependencyContext.Provider value={liveDependencies}>
				<AppProvider>
					<AuthManager>
						<Router>
							<Content />
						</Router>
					</AuthManager>
				</AppProvider>
			</DependencyContext.Provider>
		</CssBaseline>
	);
};

export default App;
