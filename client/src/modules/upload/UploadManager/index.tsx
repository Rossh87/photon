import React from 'react';
import { uploadReducer } from './uploadState/uploadState';
import { IPreprocessedFile, TPreprocessingResults } from '../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
import {IImageUploadState} from './uploadState/stateTypes'
import {preprocessImages} from '../../../core/imageReducer/preprocessImages'
import {processAllImages} from './helpers/processAllImages'
import UploadForm from '../UploadForm';
import SelectedImagesDisplay from '../SelectedImagesDisplay';
import { pipe } from 'fp-ts/lib/function';
import { TUserState } from '../../auth/AuthManager/authTypes';
import { fold, map} from 'fp-ts/lib/Option'
import axios from 'axios';
import {fromArray} from 'fp-ts/lib/NonEmptyArray';
import * as imageReducer from '../../../core/imageReducer'
import { IAsyncDependencies } from '../../../core/sharedTypes';
import {ReaderTaskEither} from 'fp-ts/lib/ReaderTaskEither';

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
		
		const callWithDeps = (deps: IAsyncDependencies) => (a: Function) => a(deps);

		const run = callWithDeps({fetcher: axios, dispatch: uploadDispatch, imageReducer: imageReducer.resizeImage})

		// does nothing if uploadState.selectedFiles is unpopulated
		pipe(
			uploadState.selectedFiles, 
			fromArray,
			map(processAllImages),
			map(run)
		);
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
