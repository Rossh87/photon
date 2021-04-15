import React from 'react';
import Container from '@material-ui/core/Container';
import UploadForm from '../../Uploader/ui/UploadForm';
import Uploader from '../../Uploader'
import SelectedImagesDisplay from '../../Uploader/ui/SelectedImagesDisplay'
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

    const renderChild: (u: TUserState) => React.ReactElement = (u) => u ? <Uploader user={authState.user}/> : <Login />

    return(
        <Container maxWidth='md'>
            <Loading status={authState.status} />
            {renderChild(authState.user)}
        </Container>
    )
};

export default Landing;
