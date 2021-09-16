import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ListItem, IconButton, Tooltip } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import { INavItemData } from '../navItems';

const useStyles = makeStyles((theme: Theme) => ({
	item: {
		paddingTop: 1,
		paddingBottom: 1,
		color: theme.palette.primary.main,
		width: '50px',
		height: '50px',
		// '&:hover, &:focus': {
		// 	backgroundColor: alpha(theme.palette.primary.light, 0.2),
		// },
	},
	itemActiveItem: {
		color: theme.palette.secondary.light,
		boxShadow: `0px 0px 3px 1px ${theme.palette.secondary.light}`,
	},

	navItemLink: {
		textDecoration: 'none',
	},
}));

const NavItem: React.FunctionComponent<
	INavItemData & { handleClick: () => void }
> = ({ pageName, icon, matchesRouterPath, handleClick }) => {
	const classes = useStyles();

	const location = useLocation();

	const isActive = location.pathname === matchesRouterPath;

	return (
		<Link to={matchesRouterPath} className={classes.navItemLink}>
			<ListItem onClick={handleClick}>
				<Tooltip placement="right-end" title={pageName}>
					<IconButton
						className={clsx(
							classes.item,
							isActive && classes.itemActiveItem
						)}
						onClick={handleClick}
					>
						{icon}
					</IconButton>
				</Tooltip>
			</ListItem>
		</Link>
	);
};

export default NavItem;
