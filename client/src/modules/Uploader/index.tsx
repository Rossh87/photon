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
import { Paper, Snackbar, IconButton } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { canProcess } from './state/reducerUtils/canProcess';
import { updateDisplayName } from './useCases/updateDisplayName';
import { none, map as OMap, foldW as OFoldW } from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';
import { constVoid } from 'fp-ts/lib/function';
import { identity } from 'fp-ts/lib/function';

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
		componentLevelError: none,
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

	const submitIsDisabled = !canProcess(uploadState);

	const renderSnackbar = () =>
		pipe(
			uploadState.componentLevelError,
			OMap((err) => (
				<Snackbar
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					ContentProps={{
						style: {
							backgroundColor: 'red',
						},
					}}
					message={err.message}
					open={true}
					action={
						<IconButton
							aria-label="close-upload-component-err"
							onClick={() =>
								uploadDispatch({ type: 'CLEAR_COMPONENT_ERR' })
							}
						>
							<CloseOutlined />
						</IconButton>
					}
				></Snackbar>
			)),
			OFoldW(constVoid, identity)
		);

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
					user={user}
					acceptedExtensions={acceptedExtensions}
					selectedFiles={uploadState.selectedFiles}
				/>
				{renderSnackbar()}
			</Paper>
		</main>
	);
};

export default Uploader;
