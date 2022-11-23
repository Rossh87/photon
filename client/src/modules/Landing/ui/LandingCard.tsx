import React, { PropsWithChildren, ReactElement } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

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

const LandingCard: React.FunctionComponent<
	PropsWithChildren<ILandingCardProps>
> = ({ alt, url, title, actions, heading, children }) => {
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
