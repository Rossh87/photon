import React, {useContext} from 'react';
import {IUser} from './types'

const Home: React.FunctionComponent = (props) => {
    const userContext = useContext(UserContext) 

    return(
        <React.Fragment>
            <h1>Auth successful!</h1>
            <p>Here are your user props:
            {userContext}
        </p></React.Fragment>
    )
}