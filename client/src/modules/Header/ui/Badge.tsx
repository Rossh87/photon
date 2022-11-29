import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FunctionComponent } from 'react';
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

const Badge: FunctionComponent = () => {
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
