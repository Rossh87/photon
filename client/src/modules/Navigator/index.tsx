import React from 'react';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import navItems from './navItems'
import NavItem from './NavItem'

const useStyles = makeStyles((theme: Theme) =>
  ({
    categoryHeader: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    categoryHeaderPrimary: {
      color: theme.palette.common.white,
    },
    item: {
      paddingTop: 1,
      paddingBottom: 1,
      color: 'rgba(255, 255, 255, 0.7)',
      '&:hover, &:focus': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
    itemCategory: {
      backgroundColor: '#232f3e',
      boxShadow: '0 -1px 0 #404854 inset',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    firebase: {
      fontSize: 24,
      color: theme.palette.common.white,
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
    divider: {
      marginTop: theme.spacing(2),
    },
  }))

// export interface NavigatorProps
//   extends Omit<DrawerProps, 'classes'>,
//     WithStyles<typeof styles> {}

const Navigator: React.FunctionComponent<Omit<DrawerProps, 'classes'>> = (props) => {
  const classes = useStyles();

  const [activeNavItem, setActiveNavItem] = React.useState<number>(0);


  return (
    <Drawer variant="permanent" {...props}>
      <List disablePadding>
        <ListItem
          className={clsx(classes.firebase, classes.item, classes.itemCategory)}
		  key={'invariant'}
        >
          Photon
        </ListItem>
        {navItems.map((vals, i) => (
          <NavItem {...vals} active={i === activeNavItem} handleClick={() => setActiveNavItem(i)}></NavItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Navigator;