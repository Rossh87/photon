import React from 'react';
import UploadForm from './ui/UploadForm';
import SelectedImagesDisplay from './ui/SelectedImagesDisplay';
import { canProcess } from './state/reducerUtils/canProcess';
import { useAppDispatch, useAppState } from '../appState/useAppState';

const Uploader: React.FunctionComponent = () => {
	const { user, uploader } = useAppState();

	const appDispatch = useAppDispatch();

	const acceptedExtensions = ['image/jpg', 'image/jpeg', 'image/png'];

	const submitIsDisabled = !canProcess(uploader);
	return (
		<>
			<SelectedImagesDisplay
				uploadState={uploader}
				uploadDispatch={appDispatch}
			/>
			<UploadForm
				submitIsDisabled={submitIsDisabled}
				dispatch={appDispatch}
				user={user}
				acceptedExtensions={acceptedExtensions}
				selectedFiles={uploader.selectedFiles}
			/>
		</>
	);
};

export default Uploader;
