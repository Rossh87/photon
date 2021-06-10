import React, { Dispatch } from 'react';
import { TPreprocessingResults, IImage } from '../domain/domainTypes';
import { IImageUploadState, TUploaderActions } from '../state/uploadStateTypes';
import List from '@material-ui/core/List';
import SelectedImage from './SelectedImage';

interface IDisplayProps {
	uploadState: IImageUploadState;
	uploadDispatch: Dispatch<TUploaderActions>;
}

// TODO: passing of error message to list item component through a null prop isn't great...
const SelectedImagesDisplay: React.FunctionComponent<IDisplayProps> = ({
	uploadState,
	uploadDispatch,
}) => {
	const { selectedFiles } = uploadState;

	const generateSelectedImageItems = (imageFiles: TPreprocessingResults) =>
		imageFiles.map((f) => (
			<SelectedImage
				imageFile={f}
				uploadDispatch={uploadDispatch}
				key={f.displayName}
			/>
		));

	return selectedFiles.length ? (
		<List>
			{generateSelectedImageItems(selectedFiles as TPreprocessingResults)}
		</List>
	) : null;
};

export default SelectedImagesDisplay;
