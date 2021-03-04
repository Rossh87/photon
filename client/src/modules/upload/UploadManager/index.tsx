import React from 'react';
import { uploadReducer } from './uploadState';
import { IImageUploadState, IProcessedFile } from './uploadTypes';
import { preprocessFiles } from './preprocessFiles';
import UploadForm from '../UploadForm';
import SelectedFilesDisplay from '../SelectedFilesDisplay';
import { fold as Tfold } from 'fp-ts/lib/These';
import { pipe } from 'fp-ts/lib/function';
import { TUserState } from '../../auth/AuthManager/authTypes';

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
		console.log('submit!');
	};

	const handleInvalidFileRemoval = (fileName: string) =>
		uploadDispatch({ type: 'UNSELECT_INVALID_FILE', data: fileName });
	const handleValidFileRemoval = (fileName: string) =>
		uploadDispatch({ type: 'UNSELECT_VALID_FILE', data: fileName });

	const handleUpdate = (
		previousName: string,
		updates: Partial<IProcessedFile>
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

	return (
		<div>
			<SelectedFilesDisplay
				uploadState={uploadState}
				handleInvalidFileRemoval={handleInvalidFileRemoval}
				handleValidFileRemoval={handleValidFileRemoval}
				handleUpdate={handleUpdate}
			/>
			<UploadForm
				handleFileChange={_handleFileChange}
				handleSubmit={handleSubmit}
				acceptedExtensions={acceptedExtensions}
			/>
		</div>
	);
};

export default UploadManager;
