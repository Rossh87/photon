import React from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  Theme
} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

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
    }
  }));

interface NavItemProps {
	id: string,
	icon: React.ReactElement,
	active?: boolean,
	handleClick: () => void
}

const NavItem: React.FunctionComponent<NavItemProps> = ({id, icon, active, handleClick}) => {
	const classes = useStyles();

	return (<React.Fragment>
	  <ListItem
	  		onClick={handleClick}
		  key={id}
		  button
		  className={clsx(classes.item, active && classes.itemActiveItem)}
		>
		  <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
		  <ListItemText
			classes={{
			  primary: classes.itemPrimary,
			}}
		  >
			{id}
		  </ListItemText>
		</ListItem>
	</React.Fragment>)
}

export default NavItem;