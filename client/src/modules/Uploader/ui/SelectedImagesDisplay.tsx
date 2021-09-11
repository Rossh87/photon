import React, { Dispatch } from 'react';
import { TPreprocessingResults } from '../domain/domainTypes';
import { IImageUploadState, TUploaderActions } from '../state/uploadStateTypes';
import List from '@material-ui/core/List';
import SelectedImage from './SelectedImage';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	selectedFileContainer: {
		border: '2px solid rgba(184,184,184, 0.5)',
		borderRadius: '10px',
		height: '50vh',
		margin: theme.spacing(2),
		overflow: 'auto',
	},
}));

interface IDisplayProps {
	uploadState: IImageUploadState;
	uploadDispatch: Dispatch<TUploaderActions>;
}

// TODO: passing of error message to list item component through a null prop isn't great...
const SelectedImagesDisplay: React.FunctionComponent<IDisplayProps> = ({
	uploadState,
	uploadDispatch,
}) => {
	const classes = useStyles();

	const { selectedFiles } = uploadState;

	const generateSelectedImageItems = (imageFiles: TPreprocessingResults) =>
		imageFiles.map((f) => (
			<SelectedImage
				imageFile={f}
				dispatch={uploadDispatch}
				key={f.displayName}
			/>
		));

	return (
		<div className={classes.selectedFileContainer}>
			<List>
				{generateSelectedImageItems(
					selectedFiles as TPreprocessingResults
				)}
			</List>
		</div>
	);
};

export default SelectedImagesDisplay;
