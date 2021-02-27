import React from 'react';
import { IUser } from '../AuthManager/authTypes';
import Container from '@material-ui/core/Container'

interface IProps {
    user: IUser
}

const Landing: React.FunctionComponent<IProps> = ({user}) => {
    const data = JSON.stringify(user)
    return(
        <Container maxWidth='md'>
            <h1>here's your fucking data:</h1>
            <p>{data}</p>
        </Container>
    )
};

export default Landing;
