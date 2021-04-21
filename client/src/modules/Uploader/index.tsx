import React, { Dispatch } from 'react';
import { uploadReducer } from './state/uploadReducer';
import { TPreprocessArgs } from './domain/domainTypes';
import { IImageUploadState, TUploaderActions, TSelectedFilesState } from './state/uploadStateTypes';
import { preprocessImages } from './useCases/preProcessSelectedFiles';
import { processSelectedFiles } from './useCases/processSelectedFiles';
import DependencyContext, {IDependencies} from '../../core/dependencyContext'
import UploadForm from './ui/UploadForm';
import SelectedImagesDisplay from './ui/SelectedImagesDisplay';
import { useFPMiddleware } from 'react-use-fp';
import { useAuthState } from '../Auth/state/useAuthState';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {hasFileErrors} from './state/reducerUtils/hasFileErrors';

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

	const [uploadState, uploadDispatch, withUploadDispatch] = useFPMiddleware(
		uploadReducer,
		defaultState
	);

	withUploadDispatch<IDependencies<TUploaderActions>, TSelectedFilesState>(
		'PROCESS_FILES'
	)(processSelectedFiles, makeDependencies);

	withUploadDispatch<Dispatch<TUploaderActions>, TPreprocessArgs>(
		'FILES_CHANGED'
	)(preprocessImages);

	const acceptedExtensions = ['image/jpg', 'image/jpeg', 'image/png'];

	const submitIsDisabled =
		hasFileErrors(uploadState.selectedFiles) ||
		uploadState.selectedFiles.length === 0;

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
	)
};

export default Uploader;
