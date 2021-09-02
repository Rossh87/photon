import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { GITHUB_OAUTH_ENDPOINT } from '../../CONSTANTS';
import GitHubIcon from '@material-ui/icons/GitHub';

const useStyles = makeStyles((theme) => ({
	button: {
		color: theme.palette.common.white,
		backgroundColor: '#2da44e',
		borderRadius: '0',
		height: '50px',
		width: '240px',
		padding: '0 15px',
		boxShadow: 'rgb(0 0 0 / 25%) 0px 2px 4px 0px',
		'&:hover': {
			backgroundColor: '#2da44e',
			boxShadow: 'rgb(45 164 78 / 30%) 0px 0px 3px 3px',
		},
	},

	label: {
		fontSize: '16px',
		justifyContent: 'space-between',
		textTransform: 'none',
	},

	icon: {
		width: theme.spacing(4),
		height: theme.spacing(4),
	},
}));
const GithubOAuthButton: React.FunctionComponent = (props) => {
	const classes = useStyles();

	return (
		<Button
			startIcon={<GitHubIcon className={classes.icon} />}
			className={classes.button}
			href={GITHUB_OAUTH_ENDPOINT}
			classes={{
				label: classes.label,
			}}
		>
			Sign in with Github
		</Button>
	);
};

export default GithubOAuthButton;
