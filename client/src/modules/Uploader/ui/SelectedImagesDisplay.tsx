import React from 'react';
import {
	TPreprocessingResults,
	IImage
} from '../domain/domainTypes';
import { IImageUploadState } from '../state/uploadStateTypes'
import List from '@material-ui/core/List';
import SelectedImage from './SelectedImage'

interface IDisplayProps {
	uploadState: IImageUploadState;
	handleFileRemoval: (f: string) => void;
	handleFileUpdate: (p: string, u: Partial<IImage>) => void;
}

// TODO: passing of error message to list item component through a null prop isn't great...
const SelectedImagesDisplay: React.FunctionComponent<IDisplayProps> = ({
	uploadState,
	handleFileRemoval,
	handleFileUpdate,
}) => {
	const {selectedFiles} = uploadState;

	const generateSelectedImageItems = (imageFiles: TPreprocessingResults) =>
		imageFiles.map((f) => (
			<SelectedImage
				imageFile={f}
				handleRemoval={handleFileRemoval}
				handleFileUpdate={handleFileUpdate}
				key={f.displayName}
			/>
		));

	return selectedFiles.length? <List>{generateSelectedImageItems(selectedFiles as TPreprocessingResults)}</List> : null;
};

export default SelectedImagesDisplay