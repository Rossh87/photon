import React from 'react';
import {TUserState, TAuthStatus} from '../AuthManager/authTypes'
import Landing from '../Landing';
import Login from '../Login'
import Loading from '../Loading'

interface IProps {
    user: TUserState
    status: TAuthStatus
}

const Main: React.FunctionComponent<IProps> = ({user, status}) => {
    const renderChild: (u: TUserState) => React.ReactElement = (u) => u ? <Landing user={u} /> : <Login />

    return(
        <React.Fragment>
            <Loading status={status} />
            {renderChild(user)}
        </React.Fragment>
    )
}

export default Main;