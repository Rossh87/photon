import React from 'react';
import Container from '@material-ui/core/Container';
import UploadForm from '../UploadForm';
import UploadManager from '../UploadManager'
import SelectedFilesDisplay from '../SelectedFilesDisplay'
import {TUserState} from '../../auth/AuthManager/authTypes'
import Login from '../../auth/Login'
import Loading from '../../auth/Loading'
import {useAuthState} from '../../auth/AuthManager/useAuthState'
import {IAuthState} from '../../auth/AuthManager/authTypes'

interface IHomeProps {
    user: IAuthState['user']
}

const Landing: React.FunctionComponent = () => {
    const authState = useAuthState();

    const renderChild: (u: TUserState) => React.ReactElement = (u) => u ? <UploadManager user={authState.user}/> : <Login />

    return(
        <Container maxWidth='md'>
            <Loading status={authState.status} />
            {renderChild(authState.user)}
        </Container>
    )
};

export default Landing;
