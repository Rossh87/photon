import React, { useEffect } from 'react';
import { fetchUserData } from './http/fetchUserData';
import {useAuthDispatch} from './state/useAuthState';

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
