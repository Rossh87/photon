import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import navItems from '../navItems';
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
		<nav>
			<Hidden smDown>
				<Drawer
					PaperProps={{
						style: {
							boxShadow:
								'0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
							backgroundColor: 'white',
							border: 'none',
							width: '100px',
							height: '350px',
							marginTop: '157px',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'space-around',
							marginLeft: '1vw',
							marginRight: '5vw',
							borderRadius: '10px',
						},
					}}
					anchor="left"
					variant="permanent"
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
		</nav>
	);
};

export default Navigator;
