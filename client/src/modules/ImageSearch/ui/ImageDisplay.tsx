import React from 'react';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ImageListItem from '@mui/material/ImageListItem';
import { makeStyles } from '@mui/styles';
import { pipe } from 'fp-ts/function';
import { fromArray, map as NEAMap } from 'fp-ts/NonEmptyArray';
import { map as OMap, getOrElseW } from 'fp-ts/Option';
import { IClientUpload } from 'sharedTypes/Upload';
import { useMediaQuery, useTheme } from '@mui/material';
import { useAppDispatch, useAppState } from '../../appState/useAppState';
import { clientUploadToConfigurable } from '../helpers/clientUploadToConfigurable';
import ImageConfigurationDialog from './ImageConfigurationDialog';

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

	const { images } = useAppState();

	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('md'));

	const dispatch = useAppDispatch();

	const emptyUI = (
		<Typography color="textSecondary">No results found!</Typography>
	);

	const handleClick =
		(clickedImg: IClientUpload): React.MouseEventHandler =>
		(e) => {
			e.stopPropagation();
			dispatch({
				type: 'IMAGE_CONFIG/SET_IMAGE_UNDER_CONFIGURATION',
				payload: clientUploadToConfigurable(clickedImg),
			});
		};

	const mapImagesToUI = pipe(
		(imgProps: IClientUpload) => (
			<ImageListItem
				key={imgProps._id}
				onClick={handleClick(imgProps)}
				aria-label={`open embed code configuration for ${imgProps.displayName}`}
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
			images.currentlyActiveImages,
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
			<ImageConfigurationDialog />
		</div>
	);
};

export default ImageDisplay;
