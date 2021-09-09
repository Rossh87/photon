import React from 'react';
import Typography from '@material-ui/core/Typography';
import ImageList from '@material-ui/core/ImageList';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageDialog from './ImageDialog';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { pipe } from 'fp-ts/function';
import { fromArray, map as NEAMap } from 'fp-ts/NonEmptyArray';
import { map as OMap, getOrElseW } from 'fp-ts/Option';
import { IClientUpload } from 'sharedTypes/Upload';
import {
	useImageSearchDispatch,
	useImageSearchState,
} from '../state/useImageSearchState';
import { useMediaQuery, useTheme } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
	},

	listItem: {
		'&:hover': {
			cursor: 'pointer',

			border: `1px solid ${theme.palette.primary.main}`,
		},

		border: '1px solid rgba(0,0,0,0)',
	},

	list: {
		width: '100%',
	},
}));

const ImageDisplay: React.FunctionComponent = () => {
	const classes = useStyles();

	const { currentlyActiveImages, imageUnderConfiguration } =
		useImageSearchState();

	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));

	const imageSearchDispatch = useImageSearchDispatch();

	const emptyUI = (
		<Typography color="textSecondary">No results found!</Typography>
	);

	const handleClick =
		(clickedImg: IClientUpload): React.MouseEventHandler =>
		(e) => {
			e.stopPropagation();
			imageSearchDispatch({
				type: 'SET_IMG_UNDER_CONFIGURATION',
				payload: clickedImg,
			});
		};

	const mapImagesToUI = pipe(
		(imgProps: IClientUpload) => (
			<ImageListItem
				key={imgProps._id}
				onClick={handleClick(imgProps)}
				aria-label={`open embed code configuration for ${imgProps.displayName}`}
				// role="button"
				className={classes.listItem}
				cols={matches ? 3 : 2}
				rows={1}
			>
				<img
					src={`${imgProps.publicPathPrefix}/${imgProps.availableWidths[0]}`}
					alt=""
				/>
				<ImageListItemBar title={imgProps.displayName} />
			</ImageListItem>
		),
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
		<div className={classes.list}>
			<ImageList
				className={classes.root}
				gap={10}
				rowHeight={200}
				cols={6}
			>
				{renderImages()}
			</ImageList>
			{imageUnderConfiguration && <ImageDialog />}
		</div>
	);
};

export default ImageDisplay;
