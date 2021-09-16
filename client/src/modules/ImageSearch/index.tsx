import React, { useEffect } from 'react';
import ImageDisplay from './ui/ImageDisplay';
import ImageSearchBar from './ui/ImageSearchBar';
import { useAppActions } from '../appState/useAppState';

export const ImageSearchPage: React.FunctionComponent = (props) => {
	const actions = useAppActions();

	console.log('mounted');

	useEffect(() => actions.FETCH_IMG_DATA(), []);

	return (
		<>
			<ImageSearchBar />
			<ImageDisplay />
		</>
	);
};

export default ImageSearchPage;
