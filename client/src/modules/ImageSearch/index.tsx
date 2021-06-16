import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import React, { useContext, useEffect } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import ImageDisplay from './ui/ImageDisplay';
import ImageSearchBar from './ui/ImageSearchBar';
import DependencyContext from '../../core/dependencyContext';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFPMiddleware } from 'react-use-fp';
import imageSearchReducer from './state/imageSearchReducer';
import { IImageSearchState } from './state/imageSearchStateTypes';
import { fetchImageData } from './http/fetchImageData';
import { getSearchResults } from './useCases/getSearchResults';

const useStyles = makeStyles((theme: Theme) => ({
	paper: {
		maxWidth: 936,
		margin: 'auto',
		overflow: 'hidden',
	},
}));

const ImageSearch: React.FunctionComponent = (props) => {
	const classes = useStyles();

	const makeDeps = useContext(DependencyContext);

	const defaultState: IImageSearchState = {
		imageMetadata: [],
		currentlyActiveImages: [],
		error: null,
	};
	const [imageSearchState, imageSearchDispatch, withDispatch] =
		useFPMiddleware(imageSearchReducer, defaultState);

	// TODO: ideally, compiler should catch if makeDependencies
	// is passed in with a handler that doesn't need it
	withDispatch('FETCH_IMG_DATA')(fetchImageData, makeDeps);
	withDispatch('INIT_IMG_SEARCH')(getSearchResults);

	useEffect(() => imageSearchDispatch({ type: 'FETCH_IMG_DATA' }), []);

	return (
		<Paper className={classes.paper}>
			<ImageSearchBar
				dispatch={imageSearchDispatch}
				imgData={imageSearchState.imageMetadata}
			/>
			<ImageDisplay
				currentlyActiveImages={imageSearchState.currentlyActiveImages}
				dispatch={imageSearchDispatch}
			/>
		</Paper>
	);
};

export default ImageSearch;
