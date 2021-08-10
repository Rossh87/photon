import React, { Dispatch, useState } from 'react';
import {
    TAvailableImageWidths,
    TFetchedImageData,
} from '../domain/ImageSearchDomainTypes';
import { TImageSearchActions } from '../state/imageSearchStateTypes';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import InfoIcon from '@material-ui/icons/Info';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ImageDialog } from './ImageDialog';

const useStyles = makeStyles((theme: Theme) => ({
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
}));

const ImageItem: React.FunctionComponent<TFetchedImageData> = ({
    publicPathPrefix,
    displayName,
    availableWidths,
}) => {
    const classes = useStyles();

    const [isOpen, setOpen] = useState(false);

    return (
        <ImageListItem>
            <img src={`${publicPathPrefix}/${availableWidths[0]}`} alt="" />
            <ImageListItemBar
                title={displayName}
                actionIcon={
                    <IconButton
                        aria-label={`info about user image ${displayName}`}
                        className={classes.icon}
                    >
                        <InfoIcon />
                    </IconButton>
                }
            />
        </ImageListItem>
    );
};

export default ImageItem;
