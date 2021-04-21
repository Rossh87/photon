import React, { Dispatch } from 'react';
import { uploadReducer } from './state/uploadReducer';
import { TPreprocessArgs } from './domain/domainTypes';
import {
	IImageUploadState,
	TSelectedFilesState,
	TUploaderActions,
} from './state/uploadStateTypes';
import { preprocessImages } from './useCases/preProcessSelectedFiles';
import { processSelectedFiles } from './useCases/processSelectedFiles';
import UploadForm from './ui/UploadForm';
import SelectedImagesDisplay from './ui/SelectedImagesDisplay';
import { useFPMiddleware } from 'react-use-fp';
import { hasFileErrors } from './state/reducerUtils/hasFileErrors';
import DependencyContext, { IDependencies } from '../../core/dependencyContext';
import { useAuthState } from '../Auth/state/useAuthState';

const Uploader: React.FunctionComponent = () => {
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
		<div>
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
		</div>
	);
};

export default Uploader;
