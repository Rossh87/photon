import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import { List, Button, ListItem, IconButton, Hidden } from '@material-ui/core';
import navItems from './navItems';
import NavItem from './NavItem';

export const navLinkActiveColor = '#4fc3f7';

const useStyles = makeStyles((theme: Theme) => ({
	itemCategory: {
		backgroundColor: theme.palette.primary.main,
		boxShadow: `0 -1px 0 ${theme.palette.primary.main} inset`,
		fontSize: 24,
		color: theme.palette.common.white,
		textAlign: 'center',
	},

	navIcon: {
		fill: theme.palette.common.white,
	},

	navList: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
	},
}));

export interface INavigatorProps extends Omit<DrawerProps, 'classes'> {
	setDrawerOpen: (a: boolean) => void;
}

const Navigator: React.FunctionComponent<INavigatorProps> = ({
	setDrawerOpen,
	...passThrough
}) => {
	const classes = useStyles();

	return (
		<>
			<Hidden smDown>
				<Drawer {...passThrough} anchor="left" variant="permanent">
					<List className={classes.navList}>
						{navItems.map((vals, i) => (
							<NavItem
								handleClick={() => setDrawerOpen(false)}
								{...vals}
								key={vals.pageName}
							></NavItem>
						))}
					</List>
				</Drawer>
			</Hidden>
			<Hidden mdUp>
				<Drawer
					{...passThrough}
					anchor="left"
					variant="temporary"
					onClose={() => setDrawerOpen(false)}
				>
					<List className={classes.navList}>
						{navItems.map((vals, i) => (
							<NavItem
								handleClick={() => setDrawerOpen(false)}
								{...vals}
								key={vals.pageName}
							></NavItem>
						))}
					</List>
				</Drawer>
			</Hidden>
		</>
	);
};

export default Navigator;
