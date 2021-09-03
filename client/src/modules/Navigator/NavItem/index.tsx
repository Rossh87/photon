import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import { INavItemData } from '../navItems';

const useStyles = makeStyles((theme: Theme) => ({
	item: {
		paddingTop: 1,
		paddingBottom: 1,
		color: 'rgba(255, 255, 255, 0.7)',
		'&:hover, &:focus': {
			backgroundColor: 'rgba(255, 255, 255, 0.08)',
		},
	},
	itemActiveItem: {
		color: '#4fc3f7',
	},
	itemPrimary: {
		fontSize: 'inherit',
	},
	itemIcon: {
		minWidth: 'auto',
		marginRight: theme.spacing(2),
	},
	navItemLink: {
		textDecoration: 'none',
	},
}));

const NavItem: React.FunctionComponent<INavItemData> = ({
	pageName,
	icon,
	matchesRouterPath,
}) => {
	const classes = useStyles();

	const location = useLocation();

	const isActive = location.pathname === matchesRouterPath;

	return (
		<Link to={matchesRouterPath} className={classes.navItemLink}>
			<ListItem
				button
				className={clsx(
					classes.item,
					isActive && classes.itemActiveItem
				)}
			>
				<ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
				<ListItemText
					classes={{
						primary: classes.itemPrimary,
					}}
				>
					{pageName}
				</ListItemText>
			</ListItem>
		</Link>
	);
};

export default NavItem;
