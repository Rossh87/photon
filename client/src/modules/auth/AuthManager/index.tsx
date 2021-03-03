import React, { useEffect, useReducer } from 'react';
import App from '../../App';
import { fetchUserData } from './fetchUserData';
import AuthProvider, {useAuthDispatch, useAuthState} from './useAuthState';

const AuthManager: React.FunctionComponent = ({children}) => {
    const authDispatch = useAuthDispatch();

    useEffect(() => {
        fetchUserData(authDispatch);
    }, []);

    return (
        <div>
            {children}
        </div>
    )
};

export default AuthManager;
