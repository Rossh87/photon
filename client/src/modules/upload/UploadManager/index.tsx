import React from 'react';
import { uploadReducer } from './uploadState/uploadState';
import { IPreprocessedFile } from '../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
import {IImageUploadState} from './uploadState/stateTypes'
import {preprocessImages} from '../../../core/imageReducer/preprocessImages'
import UploadForm from '../UploadForm';
import SelectedImagesDisplay from '../SelectedImagesDisplay';
import { pipe } from 'fp-ts/lib/function';
import { TUserState } from '../../auth/AuthManager/authTypes';
import { fold} from 'fp-ts/lib/Option'

interface IProps {
	user: TUserState;
}

const UploadManager: React.FunctionComponent<IProps> = ({ user }) => {
	const defaultState: IImageUploadState = {
		status: 'awaitingFileSelection',
		selectedFiles: [],
		errors: [],
	};

	const [uploadState, uploadDispatch] = React.useReducer(
		uploadReducer,
		defaultState
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		pipe(
			uploadState.selectedFiles,
			// fromArray,
			// map(files => processAllUploads(files)({fetcher: axios, dispatch: uploadDispatch}))
		)
	};

	const handleFileRemoval = (fileName: string) =>
		uploadDispatch({ type: 'UNSELECT_FILE', data: fileName });

	const handleFileUpdate = (
		previousName: string,
		updates: Partial<IPreprocessedFile>
	) => uploadDispatch({ type: 'UPDATE_FILE', previousName, data: updates });

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		const ownerID = user?._id;

		if (files && ownerID) {
			return pipe(
				preprocessImages({ ownerID })(files),
				fold(
					() => uploadDispatch({type: 'UNSELECT_ALL', data:null}),
					(images) => uploadDispatch({type: 'FILES_SELECTED', data: images})
				)
			)
		} else {
			return;
		}
	};

	const _handleFileChange = React.useCallback(handleFileChange, []);

	const acceptedExtensions = ['image/jpg', 'image/jpeg', 'image/png'];

	const submitIsDisabled = (uploadState.selectedFiles.length === 0 || uploadState.errors.length > 0);

	return (
		<div>
			<SelectedImagesDisplay
				uploadState={uploadState}
				handleFileRemoval={handleFileRemoval}
				handleFileUpdate={handleFileUpdate}
			/>
			<UploadForm
				submitIsDisabled={submitIsDisabled}
				handleFileChange={_handleFileChange}
				handleSubmit={handleSubmit}
				acceptedExtensions={acceptedExtensions}
			/>
		</div>
	);
};

export default UploadManager;
