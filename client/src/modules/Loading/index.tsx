import React from 'react';
import Modal from '@material-ui/core/Modal';
import {TAuthStatus} from '../Auth/state/authStateTypes';

interface IProps {
    status: TAuthStatus
}

const Loading: React.FunctionComponent<IProps> = ({status}) => {
    const openState: boolean = status === 'pending';

    return (
        <Modal open={openState}>
            <h2>Loading...</h2>
        </Modal>
    )
}

export default Loading;