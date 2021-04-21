import React from 'react';
import Container from '@material-ui/core/Container';
import {TUserState} from '../Auth/domain/authDomainTypes'
import Login from '../Login'
import Loading from '../Loading'
import {useAuthState} from '../Auth/state/useAuthState'
import Main from '../Main'
import Uploader from '../Uploader'

const Landing: React.FunctionComponent = () => {
    const authState = useAuthState();

    const renderChild: (u: TUserState) => React.ReactElement = (u) => u ? <Uploader user={authState.user} /> : <Login />

    return(
        <React.Fragment>
            {renderChild(authState.user)}
        </React.Fragment>
    )
};

export default Landing;
