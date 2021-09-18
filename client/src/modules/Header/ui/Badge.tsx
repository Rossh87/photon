import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import Link from '@material-ui/core/Link';
import RouterLink from '../../RouterLink';

const useStyles = makeStyles((theme) => ({
	main: {
		fontWeight: theme.typography.fontWeightBold,
		fontSize: '1.5rem',
		color: 'inherit',
	},

	badgeLink: {
		color: 'inherit',
	},

	secondary: {
		fontStyle: 'italic',
	},
}));

const Badge: FunctionComponent = (props) => {
	const classes = useStyles();

	return (
		<RouterLink to="/" className={classes.badgeLink}>
			<Typography component="span" className={classes.main}>
				Lossy
			</Typography>
			<Typography
				color="secondary"
				component="span"
				className={classes.secondary}
			>
				alpha
			</Typography>
		</RouterLink>
	);
};
export default Badge;
