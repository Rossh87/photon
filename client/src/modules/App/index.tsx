import React from 'react';
import {TUserState, TAuthStatus} from '../auth/AuthManager/authTypes'
import Landing from '../landing/Landing';
import Login from '../auth/Login'
import Loading from '../auth/Loading'

interface IProps {
    user: TUserState
    status: TAuthStatus
}

const App: React.FunctionComponent<IProps> = ({user, status}) => {
    const renderChild: (u: TUserState) => React.ReactElement = (u) => u ? <Landing user={u} /> : <Login />

    return(
        <React.Fragment>
            <Loading status={status} />
            {renderChild(user)}
        </React.Fragment>
    )
}

export default App;