import React from 'react';
import {uploadReducer} from './uploadState'
import {IImageUploadState} from './uploadTypes'
import {preprocessFiles} from './preprocessFiles'
import UploadForm from '../UploadForm';
import SelectedFilesDisplay from '../SelectedFilesDisplay'
import {map as Emap, mapLeft as EmapLeft} from 'fp-ts/lib/Either'
import {pipe} from 'fp-ts/lib/function'
import { TUserState } from '../../auth/AuthManager/authTypes';

interface IProps {
    user: TUserState
}

const UploadManager: React.FunctionComponent<IProps> = ({user}) => {
    const defaultState: IImageUploadState = {
        status: 'awaitingFileSelection',
        selectedFiles: [],
        errors: []
    }

    const [uploadState, uploadDispatch] = React.useReducer(uploadReducer, defaultState);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('submit!')
    }
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        const ownerID = user?._id;

        if(files && ownerID){
            return pipe(
                preprocessFiles(files)({ownerID}),
                Emap(files => {
                    uploadDispatch({type: 'FILES_SELECTED', data: files});
                }),
                EmapLeft(errs => uploadDispatch({type: 'INVALID_FILE_SELECTION', data: errs}))
            )
        } else {
            return;
        }
    }

    const _handleFileChange = React.useCallback(handleFileChange, [])

    const acceptedExtensions = ['image/jpg', 'image/jpeg', 'image/png']

    return(
        <div>
            <UploadForm handleFileChange={_handleFileChange} handleSubmit={handleSubmit} acceptedExtensions={acceptedExtensions}/>
            <SelectedFilesDisplay selectedFiles={uploadState.selectedFiles} />
        </div>
    )
}

export default UploadManager;