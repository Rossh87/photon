import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import React, { Dispatch } from 'react';
import { TFetchedImageData } from '../domain/ImageSearchDomainTypes';
import { TImageSearchActions } from '../state/imageSearchStateTypes';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
	imageDisplayContainer: {
		margin: '40px 16px',
	},

	root: {
		maxWidth: 345,
	},

	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},

	avatar: {
		backgroundColor: red[500],
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
					<Card className={classes.root} key={_id}>
						<CardHeader
							avatar={
								<Avatar
									aria-label="recipe"
									className={classes.avatar}
								>
									R
								</Avatar>
							}
							title={displayName}
							subheader={mediaType}
						/>
						<CardMedia
							role="img"
							className={classes.media}
							image={`${publicPathPrefix}/${availableWidths[0]}`}
							title="Paella dish"
						/>
					</Card>
				)
			)
		) : (
			<Typography color="textSecondary">No results found!</Typography>
		);

	return (
		<Grid container className={classes.imageDisplayContainer}>
			{renderImages()}
		</Grid>
	);
};

export default ImageDisplay;
