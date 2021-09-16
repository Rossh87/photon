import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
	main: {
		fontWeight: theme.typography.fontWeightBold,
		fontSize: '1.5rem',
		color: theme.palette.common.white,
	},

	secondary: {
		fontStyle: 'italic',
	},
}));

const Badge: FunctionComponent = (props) => {
	const classes = useStyles();

	return (
		<Link href="http://localhost:3000" underline="none">
			<Box>
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
			</Box>
		</Link>
	);
};
export default Badge;
