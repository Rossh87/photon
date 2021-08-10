import React, { useState } from 'react';
import { TFetchedImageData } from '../domain/ImageSearchDomainTypes';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import { makeStyles } from '@material-ui/core/styles';
import ImageDialog from './ImageDialog';

const useStyles = makeStyles(() => ({
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },

    listItem: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
}));

// don't use React.FunctionComponent since we don't want children prop on this component
const ImageItem = (props: TFetchedImageData) => {
    const classes = useStyles();

    const [isOpen, setOpen] = useState(false);

    const { displayName, availableWidths, publicPathPrefix } = props;

    const handleClick: React.MouseEventHandler = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    return (
        <React.Fragment>
            <ImageListItem
                onClick={handleClick}
                aria-label={`open embed code configuration for ${displayName}`}
                role="button"
                className={classes.listItem}
            >
                <img src={`${publicPathPrefix}/${availableWidths[0]}`} alt="" />
                <ImageListItemBar
                    title={displayName}
                    // actionIcon={
                    //     <IconButton
                    //         aria-label={`info about user image ${displayName}`}
                    //         className={classes.icon}
                    //     >
                    //         <InfoIcon />
                    //     </IconButton>
                    // }
                />
            </ImageListItem>
            <ImageDialog isOpen={isOpen} setOpen={setOpen} {...props} />
        </React.Fragment>
    );
};

export default ImageItem;
