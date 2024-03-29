import { FunctionComponent } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
	bareLink: {
		textDecoration: 'none',
		color: theme.palette.secondary.main,

		'&:hover': {
			textDecoration: 'underline',
		},
	},

	bodyText: {
		lineHeight: '32px',
	},

	heading: {
		textAlign: 'center',
	},
}));

const WelcomeText: FunctionComponent = () => {
	const classes = useStyles();

	return (
		<Container maxWidth="sm">
			<Typography className={classes.heading} variant="h4">
				Welcome to Lossy
			</Typography>
			<Box textAlign="center" mb={2}>
				<Typography variant="subtitle1">
					(Please pardon our dust)
				</Typography>
			</Box>
			<Typography variant="body1" className={classes.bodyText}>
				Lossy is under active development, check back often for new
				features! In the meantime, use it as much as you like... But
				back up your data. Please submit questions, comments, and bug
				reports to{' '}
				<a
					className={classes.bareLink}
					href="mailto:hunter.dev.87@gmail.com"
				>
					hunter.dev.87@gmail.com
				</a>
				, or open an issue{' '}
				<a
					className={classes.bareLink}
					href="https://github.com/Rossh87/photon"
				>
					on Github
				</a>
				. Enjoy your stay!
			</Typography>
		</Container>
	);
};

export default WelcomeText;
