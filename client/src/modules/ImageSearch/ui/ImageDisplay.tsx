import React, { Dispatch } from 'react';
import { TFetchedImageData } from '../domain/ImageSearchDomainTypes';
import { TImageSearchActions } from '../state/imageSearchStateTypes';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import InfoIcon from '@material-ui/icons/Info';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ImageItem } from './ImageItem';
import { pipe } from 'fp-ts/lib/function';
import { fromArray } from 'fp-ts/lib/NonEmptyArray';
import { map as OMap } from 'fp-ts/Option';

const useStyles = makeStyles((theme: Theme) => ({
    imageDisplayContainer: {
        margin: '40px 16px',
    },

    root: {
        maxWidth: 345,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },

    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },

    avatar: {
        backgroundColor: red[500],
    },

    ImageList: {
        width: '100%',
    },

    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
}));

interface IProps {
    currentlyActiveImages: TFetchedImageData[];
    dispatch: Dispatch<TImageSearchActions>;
}

const ImageDisplay: React.FunctionComponent<IProps> = ({
    currentlyActiveImages,
    dispatch,
}) => {
    const classes = useStyles();

    const renderImages = () => pipe(currentlyActiveImages, fromArray);
    currentlyActiveImages.length > 0 ? (
        currentlyActiveImages.map((img) => <ImageItem key={img._id} {...img} />)
    ) : (
        <Typography color="textSecondary">No results found!</Typography>
    );

    return (
        <ImageList rowHeight={200} cols={4} className={classes.ImageList}>
            {renderImages()}
        </ImageList>
    );
};

export default ImageDisplay;
