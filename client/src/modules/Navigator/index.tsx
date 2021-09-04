import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import { List, Button, ListItem, IconButton } from '@material-ui/core';
import navItems from './navItems';
import NavItem from './NavItem';
import RouterLink from '../RouterLink';
import { useLocation } from 'react-router';
import BackupIcon from '@material-ui/icons/Backup';
import { Box } from '@material-ui/core';
import ExploreIcon from '@material-ui/icons/ExploreOutlined';

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
		<Drawer {...passThrough} anchor="left">
			{/* <Box
				className={clsx(classes.itemCategory)}
				padding={2}
				display="grid"
				justifyContent="center"
			>
				<RouterLink to="/">
					<IconButton>
						<ExploreIcon
							fontSize="large"
							className={classes.navIcon}
						/>
					</IconButton>
				</RouterLink>
			</Box> */}
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
	);
};

export default Navigator;
