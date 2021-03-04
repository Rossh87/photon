import React from 'react';
import Landing from '../landing/Landing';
import AuthManager from '../auth/AuthManager'
import AuthProvider from '../auth/AuthManager/useAuthState'
import PaperBase from '../../template/paperbase/Paperbase'

const App: React.FunctionComponent = (props) => {
    return(
        <AuthProvider>
            <AuthManager>
                <Landing></Landing>
            </AuthManager>
        </AuthProvider>
    )
}

export default App;