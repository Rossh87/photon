import React from 'react';
import { uploadReducer } from './state/uploadReducer';
import { TPreprocessArgs, TUpdateDisplayNameArgs } from './domain/domainTypes';
import {
	IImageUploadState,
	TUploaderActions,
	TSelectedFilesState,
} from './state/uploadStateTypes';
import { preprocessImages } from './useCases/preProcessSelectedFiles';
import { processSelectedFiles } from './useCases/processSelectedFiles';
import DependencyContext, { IDependencies } from '../../core/dependencyContext';
import UploadForm from './ui/UploadForm';
import SelectedImagesDisplay from './ui/SelectedImagesDisplay';
import { useFPReducer } from 'react-use-fp';
import { useAuthState } from '../Auth/state/useAuthState';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { canProcess } from './state/reducerUtils/canProcess';
import { updateDisplayName } from './useCases/updateDisplayName';

const useStyles = makeStyles({
	paper: {
		maxWidth: 936,
		margin: 'auto',
		overflow: 'hidden',
	},
});

const Uploader: React.FunctionComponent = () => {
	const classes = useStyles();

	const { user } = useAuthState();

	const defaultState: IImageUploadState = {
		status: 'awaitingFileSelection',
		selectedFiles: [],
	};

	const makeDependencies = React.useContext(DependencyContext);

	const [uploadState, uploadDispatch, actions] = useFPReducer(
		{
			PROCESS_FILES: processSelectedFiles,
			FILES_CHANGED: preprocessImages,
			INIT_NAME_UPDATE: updateDisplayName,
		},
		makeDependencies
	)(defaultState, uploadReducer);

	const acceptedExtensions = ['image/jpg', 'image/jpeg', 'image/png'];

	const submitIsDisabled = canProcess(uploadState.selectedFiles);

	return (
		<main>
			<Paper className={classes.paper}>
				<SelectedImagesDisplay
					uploadState={uploadState}
					uploadDispatch={uploadDispatch}
				/>
				<UploadForm
					submitIsDisabled={submitIsDisabled}
					uploadDispatch={uploadDispatch}
					ownerID={user?._id}
					acceptedExtensions={acceptedExtensions}
					selectedFiles={uploadState.selectedFiles}
				/>
			</Paper>
		</main>
	);
};

export default Uploader;
