import React from 'react';
import {TPreprocessedFiles,IProcessedFile, TPreprocessErrors, IImageUploadState} from '../UploadManager/uploadTypes';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Update from '@material-ui/icons/Update';
import Avatar from '@material-ui/core/Avatar';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';

interface IDisplayProps {
    uploadState: IImageUploadState,
    handleInvalidFileRemoval: (f: string) => void
    handleValidFileRemoval: (f: string) => void
    handleUpdate: (p: string, u: Partial<IProcessedFile>) => void;
}

// TODO: passing of error message to list item component through a null prop isn't great...
const SelectedFilesDisplay: React.FunctionComponent<IDisplayProps> = ({uploadState, handleValidFileRemoval,handleInvalidFileRemoval, handleUpdate}) => {

    const generateValidFileItems = (files: TPreprocessedFiles) => files.map(f => (
        <FileListItem 
            isValid={true} 
            file={f} 
            handleRemoval={handleValidFileRemoval.bind(null, f.name)} 
            handleUpdate={handleUpdate} 
            key={f.name}
            secondaryText={null}
        />
    ));

    // TODO: we have to have a null check here because we recycle the UploadError structure
    // a lot.  Could be improved.
    const generateInvalidFileItems = (errs: TPreprocessErrors) => errs.map(e => e.invalidFile ? (
        <FileListItem 
            isValid={false}
            file={e.invalidFile} 
            handleRemoval={handleInvalidFileRemoval.bind(null, e.invalidFile.name)} 
            handleUpdate={handleUpdate}
            key={e.invalidFile.name}
            secondaryText={e.message}
        />
            
    ) : null)

    const renderListItems = () => (<React.Fragment>
        {generateValidFileItems(uploadState.selectedFiles as TPreprocessedFiles)}
        {generateInvalidFileItems(uploadState.errors as TPreprocessErrors)}
    </React.Fragment>)

    return(
        <List>
            {renderListItems()}
        </List>
    )
}

interface IItemProps {
    isValid: boolean;
    file: IProcessedFile;
    handleRemoval: () => void;
    handleUpdate: (p: string, u: Partial<IProcessedFile>) => void;
    secondaryText: string | null
}

const FileListItem: React.FunctionComponent<IItemProps> = ({isValid, file, handleRemoval, secondaryText}) => {
    const textColor = isValid ? 'primary' : 'error';

    return (
        <ListItem>
            <ListItemAvatar>
            <Avatar>
                <PhotoOutlinedIcon />
            </Avatar>
            </ListItemAvatar>
            <ListItemText
            primary={file.name}
            primaryTypographyProps={{
                color: textColor
            }}
            secondary={secondaryText}
            />
            <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoval()}>
                <DeleteIcon />
            </IconButton>
            <IconButton edge="end" aria-label="update">
                <Update />
            </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default SelectedFilesDisplay;