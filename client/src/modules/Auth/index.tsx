import React, { useEffect, useReducer } from 'react';
import App from '../App';
import { fetchUserData } from './http/fetchUserData';
import AuthProvider, {useAuthDispatch, useAuthState} from './state/useAuthState';

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
