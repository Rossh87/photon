import React from 'react';
import {TPreprocessedFiles, IProcessedFile} from '../UploadManager/uploadTypes';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';

interface IProps {
    selectedFiles: TPreprocessedFiles | []
}

const SelectedFilesDisplay: React.FunctionComponent<IProps> = ({selectedFiles}) => {
    const generateListItems = (files: TPreprocessedFiles) => files.map(f => (
            <ListItem>
                <ListItemIcon>
                    <PhotoOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={f.name} />
            </ListItem>
    ));

    const renderListItems = () => selectedFiles.length ? generateListItems(selectedFiles as TPreprocessedFiles) : null;

    return(
        <List>
            {renderListItems()}
        </List>
    )
}

export default SelectedFilesDisplay;