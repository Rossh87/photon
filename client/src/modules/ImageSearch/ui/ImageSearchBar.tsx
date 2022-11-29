import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Hidden, useMediaQuery, useTheme } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { pipe } from 'fp-ts/lib/function';
import { fromPredicate, map } from 'fp-ts/lib/Option';
import {
	useAppActions,
	useAppDispatch,
	useAppState,
} from '../../appState/useAppState';

const useStyles = makeStyles((theme: Theme) => ({
	searchBar: {
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
	},
	searchInput: {
		fontSize: theme.typography.fontSize,
	},

	searchForm: {
		padding: theme.spacing(2),
		display: 'grid',
		alignItems: 'center',
	},
	block: {
		display: 'block',
	},
	addUser: {
		marginRight: theme.spacing(1),
	},

	searchBarSm: {
		padding: 0,
	},
}));

const ImageSearchBar: React.FunctionComponent = () => {
	const classes = useStyles();

	const appDispatch = useAppDispatch();
	const actions = useAppActions();
	const { images } = useAppState();
	const [searchTerm, setSearchTerm] = useState('');

	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
		setSearchTerm(e.target.value);

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		pipe(
			searchTerm,
			fromPredicate((searchTerm) => searchTerm.length > 0),
			map((searchTerm) => ({
				searchTerm,
				imgData: images.imageMetadata,
			})),
			map(actions.INIT_IMG_SEARCH),
			map(() => setSearchTerm(''))
		);
	};

	return (
		<AppBar
			className={classes.searchBar}
			position="static"
			color="default"
			elevation={0}
		>
			<Toolbar className={clsx(matches && classes.searchBarSm)}>
				<Grid container spacing={2} alignItems="center">
					<Hidden smDown>
						<Grid item>
							<SearchIcon
								className={classes.block}
								color="inherit"
							/>
						</Grid>
					</Hidden>
					<Grid item xs>
						<form
							className={classes.searchForm}
							id="imgSearchBar"
							onSubmit={handleSubmit}
						>
							<TextField
								fullWidth
								placeholder="Enter search term..."
								InputProps={{
									disableUnderline: true,
								}}
								variant="standard"
								value={searchTerm}
								onChange={handleChange}
							/>
						</form>
					</Grid>
					<Grid item>
						<Button
							type="submit"
							form="imgSearchBar"
							variant="contained"
							className={classes.addUser}
						>
							Search
						</Button>
						<Tooltip title="Reset">
							<IconButton
								onClick={() =>
									appDispatch({
										type: 'IMAGES/RESET_SEARCH',
									})
								}
								aria-label="reset-image-search"
								size="large"
							>
								<RefreshIcon
									className={classes.block}
									color="inherit"
								/>
							</IconButton>
						</Tooltip>
					</Grid>
				</Grid>
			</Toolbar>
		</AppBar>
	);
};

export default ImageSearchBar;
