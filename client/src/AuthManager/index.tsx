import React, { useEffect, useReducer } from 'react';
import Main from '../Main';
import { fetchUserData } from './fetchUserData';
import { authReducer, defaultState } from './authState';

const AuthManager: React.FunctionComponent = (props) => {
    const [state, dispatch] = useReducer(authReducer, defaultState);

    useEffect(() => {
        fetchUserData(dispatch);
    }, []);

    return (
        <Main user={state.user} status={state.status} />
    )
};

export default AuthManager;
