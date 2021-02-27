import React from 'react';
import { IUser } from '../AuthManager/authTypes';
import Container from '@material-ui/core/Container'

interface IProps {
    user: IUser
}

const Landing: React.FunctionComponent<IProps> = ({user}) => {
    const data = JSON.stringify(user)
    return(
        <Container maxWidth='md'>'authorized!: '{data}</Container>
    )
};

export default Landing;
