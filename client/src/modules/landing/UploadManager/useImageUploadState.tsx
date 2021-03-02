import React, { ChangeEvent, FormEvent } from 'react';
import Container from '@material-ui/core/Container'
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import {UploadError} from './UploadError'

interface IProps {
}

const useImageUploadState = () => {
    const [files, setFiles] = React.useState<FileList | null>(null);
    const[errors, setErrors] = React.useState<Array<UploadError>>([]);

    // needed functions:
    // 1.validate file extensions
    // 2. validate file size limit
    // 3. calculate user-readable size
    // 4. reducer to manage validation and loading state

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(files)
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newFiles = e.target.files;
        if(newFiles){
            setFiles(newFiles)
        } else {
            const err = UploadError.create('At least one file must be selected for upload');

            setErrors([...errors, err])
        }
    }

    const acceptedExtensions = '.jpg, .jpeg, .png'

    const withFileHandlerProps = (children: Array<React.FunctionComponent>) => children.forEach(Child => (
        <Child handleFileChange={handleFileChange} handleSubmit={handleSubmit} acceptedExtensions={acceptedExtensions}></Child>
    ))
    return(
        
    )
};

export default UploadManager;
