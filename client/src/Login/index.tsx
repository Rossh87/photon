import Button from '@material-ui/core/Button';
import React from 'react';
import {GOOGLE_OAUTH_ENDPOINT} from '../CONSTANTS'

const Login: React.FunctionComponent = (props) => {
    return(
        <Button color='primary' href={GOOGLE_OAUTH_ENDPOINT}>Login to google</Button>
    )
}

export default Login;