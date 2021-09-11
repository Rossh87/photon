import Paper from '@material-ui/core/Paper';
import React, { useEffect } from 'react';
import ImageDisplay from './ui/ImageDisplay';
import ImageSearchBar from './ui/ImageSearchBar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useAppActions } from '../appState/useAppState';

export const ImageSearchPage: React.FunctionComponent = (props) => {
	const actions = useAppActions();

	useEffect(() => actions.FETCH_IMG_DATA(), []);

	return (
		<>
			<ImageSearchBar />
			<ImageDisplay />
		</>
	);
};

export default ImageSearchPage;
