import Button from '@material-ui/core/Button';
import React from 'react';
import {AUTH_API_ENDPOINT} from '../CONSTANTS'

const Login: React.FunctionComponent = (props) => {
    return(
        <Button color='primary' href={AUTH_API_ENDPOINT}>Login to google</Button>
    )
}

export default Login;