import React, { MouseEventHandler } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import navItems, { INavItemData } from '../navItems';
import NavItem from './NavItem';
import { useHistory } from 'react-router';

export const navLinkActiveColor = '#4fc3f7';

const useStyles = makeStyles((theme: Theme) => ({
	visuallyHidden: {
		clip: 'rect(0 0 0 0)',
		clipPath: 'inset(50%)',
		height: '1px',
		overflow: 'hidden',
		position: 'absolute',
		whiteSpace: 'nowrap',
		width: '1px',
	},

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
	drawerOpen: boolean;
}

const Navigator: React.FunctionComponent<INavigatorProps> = ({
	setDrawerOpen,
	drawerOpen,
}) => {
	const classes = useStyles();
	const history = useHistory();

	const handleNavItemClick =
		(itemData: INavItemData): MouseEventHandler =>
		(e) => {
			setDrawerOpen(false);
			history.push(itemData.matchesRouterPath);
		};

	return (
		<nav aria-labelledby="navHeading">
			<h2 className={classes.visuallyHidden} id="navHeading">
				main navigation menu
			</h2>
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
								handleClick={handleNavItemClick(vals)}
								{...vals}
								key={vals.pageName}
							></NavItem>
						))}
					</List>
				</Drawer>
			</Hidden>
			<Hidden mdUp>
				<Drawer
					anchor="left"
					variant="temporary"
					onClose={() => setDrawerOpen(false)}
					open={drawerOpen}
				>
					<List className={classes.navList}>
						{navItems.map((vals, i) => (
							<NavItem
								handleClick={handleNavItemClick(vals)}
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
