import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import React, { Dispatch, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import { TFetchedImageData } from '../domain/ImageSearchDomainTypes';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { TImageSearchActions } from '../state/imageSearchStateTypes';
import { pipe } from 'fp-ts/lib/function';
import { fromNullable, map, fromPredicate } from 'fp-ts/lib/Option';

const useStyles = makeStyles((theme: Theme) => ({
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
}));

interface IImageSearchBarProps {
	dispatch: Dispatch<TImageSearchActions>;
	imgData: TFetchedImageData[];
}

const ImageSearchBar: React.FunctionComponent<IImageSearchBarProps> = ({
	dispatch,
	imgData,
}) => {
	const classes = useStyles();

	const [searchTerm, setSearchTerm] = useState('');

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
		setSearchTerm(e.target.value);

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		pipe(
			searchTerm,
			fromPredicate((searchTerm) => searchTerm.length > 0),
			map((searchTerm) =>
				dispatch({
					type: 'INIT_IMG_SEARCH',
					payload: {
						searchTerm,
						imgData,
					},
				})
			),
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
			<Toolbar>
				<Grid container spacing={2} alignItems="center">
					<Grid item>
						<SearchIcon className={classes.block} color="inherit" />
					</Grid>
					<Grid item xs>
						<form id="imgSearchBar" onSubmit={handleSubmit}>
							<TextField
								fullWidth
								placeholder="Enter search term..."
								InputProps={{
									disableUnderline: true,
									className: classes.searchInput,
								}}
								variant="standard"
								value={searchTerm}
								onChange={handleChange}
							/>
						</form>
					</Grid>
					<Grid item>
						<Tooltip title="Search">
							<Button
								type="submit"
								form="imgSearchBar"
								variant="contained"
								className={classes.addUser}
							>
								Search
							</Button>
						</Tooltip>
						<Tooltip title="Reload">
							<IconButton
								onClick={() =>
									dispatch({ type: 'RESET_SEARCH' })
								}
								data-testid="reset-search-icon"
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
