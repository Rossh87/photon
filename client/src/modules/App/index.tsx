/**
 * Site design adapted from Material-UI's Paperbase theme,
 * https://material-ui.com/store/items/paperbase/
 *  */ 

import React from 'react';
import Landing from '../Landing';
import AuthManager from '../Auth'
import AuthProvider from '../Auth/state/useAuthState'
import DependencyContext, {liveDependencies} from '../../core/dependencyContext'
import {BrowserRouter as Router} from 'react-router-dom';

const App: React.FunctionComponent = (props) => {
    return(
        <AuthProvider>
            <AuthManager>
				<DependencyContext.Provider value={liveDependencies}>
					<Router>	
                		<Landing />
					</Router>
				</DependencyContext.Provider>
            </AuthManager>
        </AuthProvider>
    )
}

export default App;