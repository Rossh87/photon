import Paper from '@material-ui/core/Paper';
import React, { useEffect } from 'react';
import ImageDisplay from './ui/ImageDisplay';
import ImageSearchBar from './ui/ImageSearchBar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ImageSearchProvider, {
	useImageSearchDispatch,
} from './state/useImageSearchState';

const useStyles = makeStyles((theme: Theme) => ({
	paper: {
		// maxWidth: 936,
		// margin: 'auto',
		// overflow: 'hidden',
		padding: theme.spacing(2),
	},
}));

export const _ImageSearch: React.FunctionComponent = (props) => {
	const classes = useStyles();

	const imageSearchDispatch = useImageSearchDispatch();

	useEffect(() => imageSearchDispatch({ type: 'FETCH_IMG_DATA' }), []);

	return (
		<>
			<ImageSearchBar />
			<ImageDisplay />
		</>
	);
};

// export component wrapped with Provider separately so that we can
// easily furnish mock contexts in tests
const ImageSearchPage: React.FunctionComponent = (props) => (
	<ImageSearchProvider>
		<_ImageSearch />
	</ImageSearchProvider>
);

export default ImageSearchPage;
