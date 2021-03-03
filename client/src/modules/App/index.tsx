import React from 'react';
import {TUserState, TAuthStatus} from '../auth/AuthManager/authTypes'
import Landing from '../landing/Landing';
import AuthManager from '../auth/AuthManager'
import AuthProvider from '../auth/AuthManager/useAuthState'

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