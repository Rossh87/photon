import React, {
	ChangeEventHandler,
	FocusEventHandler,
	FormEventHandler,
	ReactElement,
	useState,
} from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles((theme) => ({
	cardHeading: {
		textAlign: 'center',
	},
}));

interface ILandingCardProps {
	alt: string;
	url: string;
	title: string;
	actions?: ReactElement;
	heading: string;
}

const LandingCard: React.FunctionComponent<ILandingCardProps> = ({
	alt,
	url,
	title,
	actions,
	heading,
	children,
}) => {
	const classes = useStyles();

	return (
		<Box flexBasis="25%" minWidth="250px">
			<Card>
				<CardMedia
					component="img"
					alt={alt}
					image={url}
					title={title}
				/>

				<CardContent>
					<Typography
						className={classes.cardHeading}
						gutterBottom
						variant="h5"
						component="div"
					>
						{heading}
					</Typography>
					<Typography variant="body2">{children}</Typography>
				</CardContent>
				{actions && <CardActions>{actions}</CardActions>}
			</Card>
		</Box>
	);
};

export default LandingCard;
