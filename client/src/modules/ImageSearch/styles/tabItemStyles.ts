// adapted from https://mui-treasury.com/styles/tabs/#Contained
// Many thanks!

import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useTabStyles = makeStyles(() => ({
	root: {
		width: '100%',
	},
	indicator: {
		display: 'none',
	},
	centered: {
		alignItems: 'center',
		justifyContent: 'center',
	},
}));

export const useTabItemStyles = makeStyles((theme: Theme) => ({
	root: {
		position: 'relative',
		display: 'block',
		borderRadius: '30px',
		textAlign: 'center',
		transition: 'all .5s',
		padding: '15px 15px',
		color: '#555555',
		height: 'auto',
		opacity: '1',
		margin: '10px 0',
		float: 'none',
		[theme.breakpoints.up('md')]: {
			minWidth: 120,
		},
		'& + button': {
			margin: '10px 0',
		},
		'&$selected': {
			'&, &:hover': {
				color: '#FFFFFF',
				backgroundColor: theme.palette.primary.main,
				boxShadow: '0 7px 10px -5px rgba(76, 175, 80, 0.4)',
			},
		},
	},
	selected: {},
	wrapper: {
		lineHeight: '24px',
		textTransform: 'uppercase',
		fontSize: theme.typography.fontSize,
		fontWeight: theme.typography.fontWeightRegular,
		position: 'relative',
		display: 'block',
		color: 'inherit',
	},
}));
