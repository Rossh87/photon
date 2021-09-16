import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {
	GITHUB_OAUTH_ENDPOINT,
	GOOGLE_OAUTH_ENDPOINT,
} from '../../../CONSTANTS';
import GoogleButton from 'react-google-button';
import { Paper } from '@material-ui/core';
import GithubOAuthButton from '../../GithubOAuthButton';

const useStyles = makeStyles((theme) => ({
	background: {
		// background: 'rgb(255,255,255)',
		background:
			'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(193,180,224,1) 52%, rgba(81,45,168,1) 79%)',
	},

	paper: {
		// marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		height: '50vh',
		minHeight: '400px',
		paddingTop: theme.spacing(8),
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	buttonGrid: {
		paddingTop: theme.spacing(5),
	},

	anchor: {
		textDecoration: 'none',
		color: 'inherit',
	},
}));

const SignupForm: React.FunctionComponent = (props) => {
	const classes = useStyles();

	return (
		<div>
			<Grid
				container
				direction="column"
				alignItems="center"
				justifyContent="center"
			>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign Up
				</Typography>
			</Grid>
			<Grid
				container
				direction="column"
				alignItems="center"
				className={classes.buttonGrid}
				spacing={3}
			>
				<TextField variant="outlined" placeholder="Email"></TextField>
				<TextField
					variant="outlined"
					placeholder="Password"
				></TextField>
				<Grid item>
					<a className={classes.anchor} href={GOOGLE_OAUTH_ENDPOINT}>
						<GoogleButton />
					</a>
				</Grid>
				<Grid item>
					<GithubOAuthButton />
				</Grid>
			</Grid>
		</div>
	);
};

export default SignupForm;