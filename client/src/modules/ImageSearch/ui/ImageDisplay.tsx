import Grid from '@material-ui/core/Grid';
import React, { Dispatch } from 'react';
import { TFetchedImageData } from '../domain/ImageSearchDomainTypes';
import { TImageSearchActions } from '../state/imageSearchStateTypes';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import InfoIcon from '@material-ui/icons/Info';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
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

	gridList: {
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
					<GridListTile key={_id}>
						<img
							src={`${publicPathPrefix}/${availableWidths[0]}`}
							alt="uploaded image in grid"
						/>
						<GridListTileBar
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
					</GridListTile>
				)
			)
		) : (
			<Typography color="textSecondary">No results found!</Typography>
		);

	return (
		<GridList cellHeight={200} cols={4} className={classes.gridList}>
			{renderImages()}
		</GridList>
	);
};

export default ImageDisplay;
