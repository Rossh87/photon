import React, { Dispatch } from 'react';
import { TImageSearchActions } from '../state/imageSearchStateTypes';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ImageList from '@material-ui/core/ImageList';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ImageItem from './ImageItem';
import { pipe } from 'fp-ts/lib/function';
import { fromArray, map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { map as OMap, getOrElseW } from 'fp-ts/Option';
import { IDBUpload } from '../../../../../sharedTypes/Upload';

const useStyles = makeStyles((theme: Theme) => ({
	imageDisplayContainer: {
		margin: '40px 16px',
	},

	root: {
		// maxWidth: 345,
		// display: 'flex',
		// flexWrap: 'wrap',
		// justifyContent: 'space-around',
		// overflow: 'hidden',
		// backgroundColor: theme.palette.background.paper,
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
		width: 700,
		height: 600,
	},

	icon: {
		color: 'rgba(255, 255, 255, 0.54)',
	},
}));

interface IProps {
	currentlyActiveImages: IDBUpload[];
	dispatch: Dispatch<TImageSearchActions>;
}

const ImageDisplay: React.FunctionComponent<IProps> = ({
	currentlyActiveImages,
	dispatch,
}) => {
	const classes = useStyles();

	const emptyUI = (
		<Typography color="textSecondary">No results found!</Typography>
	);

	const mapImagesToUI = pipe(
		(img: IDBUpload) => <ImageItem key={img._id} {...img} />,
		NEAMap
	);

	const renderImages = () =>
		pipe(
			currentlyActiveImages,
			fromArray,
			OMap(mapImagesToUI),
			getOrElseW(() => emptyUI)
		);

	return (
		<ImageList
			gap={2}
			rowHeight={200}
			cols={8}
			className={classes.ImageList}
		>
			{renderImages()}
		</ImageList>
	);
};

export default ImageDisplay;
