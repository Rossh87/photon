import React from 'react';
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import {InputLabel} from '@material-ui/core'

interface IProps {
    handleSubmit: React.FormEventHandler,
    handleFileChange:  (e: React.ChangeEvent<HTMLInputElement>) => void,
    acceptedExtensions: Array<string>,
	submitIsDisabled: boolean
}

const UploadForm: React.FunctionComponent<IProps> = ({handleSubmit, handleFileChange, acceptedExtensions, submitIsDisabled}) => {
    const inputProps = {
		accept: acceptedExtensions.join(','),
		multiple: true, 
	}

    return(
            <form onSubmit={handleSubmit}>
				<InputLabel htmlFor='fileSelectionButton'>Choose Files</InputLabel>
                <Input id='fileSelectionButton' name='select images' onChange={handleFileChange} type="file" inputProps={inputProps}></Input>
                <Button disabled={submitIsDisabled} type="submit">Submit!</Button>
            </form>
    )
}

export default UploadForm;