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

	const renderImages = () =>
		currentlyActiveImages.length > 0 ? (
			currentlyActiveImages.map(
				({
					displayName,
					mediaType,
					_id,
					publicPathPrefix,
					availableWidths,
				}) => (
					<ImageListItem key={_id}>
						<img
							src={`${publicPathPrefix}/${availableWidths[0]}`}
							alt=''
						/>
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
				)
			)
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
