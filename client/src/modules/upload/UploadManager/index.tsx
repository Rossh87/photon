import React from 'react';
import { uploadReducer } from './uploadState/uploadState';
import { IPreprocessedFile } from './uploadPreprocessing/uploadPreprocessingTypes';
import {IImageUploadState} from './uploadState/stateTypes'
import {processAllUploads} from './uploadProcessing/processAllUploads'
import { preprocessFiles } from './uploadPreprocessing/preprocessFiles';
import UploadForm from '../UploadForm';
import SelectedFilesDisplay from '../SelectedFilesDisplay';
import { fold as Tfold } from 'fp-ts/lib/These';
import { pipe } from 'fp-ts/lib/function';
import { TUserState } from '../../auth/AuthManager/authTypes';
import {fromArray} from 'fp-ts/lib/NonEmptyArray';
import {map} from 'fp-ts/lib/Option'
import axios from 'axios';

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
			fromArray,
			map(files => processAllUploads(files)({fetcher: axios, dispatch: uploadDispatch}))
		)
	};

	const handleInvalidFileRemoval = (fileName: string) =>
		uploadDispatch({ type: 'UNSELECT_INVALID_FILE', data: fileName });
		
	const handleValidFileRemoval = (fileName: string) =>
		uploadDispatch({ type: 'UNSELECT_VALID_FILE', data: fileName });

	const handleUpdate = (
		previousName: string,
		updates: Partial<IPreprocessedFile>
	) => uploadDispatch({ type: 'UPDATE_FILE', previousName, data: updates });

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		const ownerID = user?._id;

		if (files && ownerID) {
			return pipe(
				preprocessFiles({ ownerID })(files),
				Tfold(
					(errs) =>
						uploadDispatch({
							type: 'INVALID_FILE_SELECTIONS',
							data: errs,
						}),
					(processedFiles) =>
						uploadDispatch({
							type: 'FILES_SELECTED',
							data: processedFiles,
						}),
					(e, f) => {
						console.log('both')
						uploadDispatch({
							type: 'INVALID_FILE_SELECTIONS',
							data: e,
						});
						uploadDispatch({ type: 'FILES_SELECTED', data: f });
					}
				)
			);
		} else {
			return;
		}
	};

	const _handleFileChange = React.useCallback(handleFileChange, []);

	const acceptedExtensions = ['image/jpg', 'image/jpeg', 'image/png'];

	const submitIsDisabled = (uploadState.selectedFiles.length === 0 || uploadState.errors.length > 0);

	return (
		<div>
			<SelectedFilesDisplay
				uploadState={uploadState}
				handleInvalidFileRemoval={handleInvalidFileRemoval}
				handleValidFileRemoval={handleValidFileRemoval}
				handleUpdate={handleUpdate}
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
