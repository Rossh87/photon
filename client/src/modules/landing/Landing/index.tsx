import React, { ChangeEvent, FormEvent } from 'react';
import Container from '@material-ui/core/Container';
import UploadForm from '../UploadForm';
import UploadManager from '../UploadManager/useImageUploadState'

interface IProps {
}

const Landing: React.FunctionComponent<IProps> = () => {
    return(
        <Container maxWidth='md'>
            <UploadManager>
                <UploadForm></UploadForm>
            </UploadManager>
        </Container>
    )
};

export default Landing;
