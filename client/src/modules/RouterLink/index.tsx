import { makeStyles } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { Link, LinkProps } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	routerLink: {
		textDecoration: 'none',
		color: 'inherit',
	},
}));

const RouterLink: FunctionComponent<LinkProps> = ({ children, to }) => {
	const classes = useStyles();

	return (
		<Link to={to} className={classes.routerLink}>
			{children}
		</Link>
	);
};

export default RouterLink;
