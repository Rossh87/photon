import React from 'react';
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'

interface IProps {
    handleSubmit: React.FormEventHandler,
    handleFileChange:  (e: React.ChangeEvent<HTMLInputElement>) => void,
    acceptedExtensions: Array<string>
}

const UploadForm: React.FunctionComponent<IProps> = ({handleSubmit, handleFileChange, acceptedExtensions}) => {
    
    return(
            <form onSubmit={handleSubmit}>
                <Input onChange={handleFileChange} type="file" name="fileInput" inputProps={{accept: acceptedExtensions.join(','), multiple: true}}></Input>
                <Button type="submit">Submit!</Button>
            </form>
    )
}

export default UploadForm;