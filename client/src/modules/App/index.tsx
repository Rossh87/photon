import React from 'react';
import Landing from '../landing/Landing';
import AuthManager from '../auth/AuthManager'
import AuthProvider from '../auth/AuthManager/useAuthState'
import PaperBase from '../../template/paperbase/Paperbase'
import DependencyContext, {liveDependencies} from '../../core/dependencyContext'

const App: React.FunctionComponent = (props) => {
    return(
        <AuthProvider>
            <AuthManager>
				<DependencyContext.Provider value={liveDependencies}>
                	<Landing />
				</DependencyContext.Provider>
            </AuthManager>
        </AuthProvider>
    )
}

export default App;