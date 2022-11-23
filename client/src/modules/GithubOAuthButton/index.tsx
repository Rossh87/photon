import React from 'react';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { GITHUB_OAUTH_ENDPOINT } from '../../CONSTANTS';
import GitHubIcon from '@mui/icons-material/GitHub';

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

interface GithubButtonProps {
	label: string;
}

const GithubOAuthButton: React.FunctionComponent<GithubButtonProps> = ({
	label,
}) => {
	const classes = useStyles();

	return (
		<Button
			startIcon={<GitHubIcon className={classes.icon} />}
			className={classes.button}
			href={GITHUB_OAUTH_ENDPOINT}
			sx={{
				fontSize: 2,
				justifyContent: 'space-between',
				textTransform: 'none',
			}}
		>
			{`${label} with Github`}
		</Button>
	);
};

export default GithubOAuthButton;
