import React from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import { List, Hidden } from '@mui/material';
import navItems from '../Header/navItems';
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
			<Hidden mdDown>
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
