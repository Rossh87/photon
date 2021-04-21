import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import {
	makeStyles,
	createStyles,
	Theme,
	withStyles,
	WithStyles,
} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Switch, Route } from 'react-router-dom';
import Uploader from '../Uploader';
import ImageSearchPage from './ImageSearchPage';

const useStyles = makeStyles((theme: Theme) => ({
	paper: {
		maxWidth: 936,
		margin: 'auto',
		overflow: 'hidden',
	},
	searchBar: {
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
	},
	searchInput: {
		fontSize: theme.typography.fontSize,
	},
	block: {
		display: 'block',
	},
	addUser: {
		marginRight: theme.spacing(1),
	},
	contentWrapper: {
		margin: '40px 16px',
	},
}));

export interface ContentProps {}

const Content: React.FunctionComponent<ContentProps> = (
	props: ContentProps
) => {
	const classes = useStyles();

	return (
		<Switch>
			<Route path="/upload">
				<Uploader />
			</Route>
			<Route path="/imagesearch">
				<ImageSearchPage />
			</Route>
		</Switch>
	);
};

export default Content;
