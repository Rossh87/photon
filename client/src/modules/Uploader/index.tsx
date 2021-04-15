import React from 'react';
import { uploadReducer } from './uploadState/uploadState';
import { IImage, TPreprocessingResults } from '../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
import {IImageUploadState} from './uploadState/stateTypes'
import {preprocessImages} from '../../../core/imageReducer/preprocessImages'
import {processSelectedFiles} from '../useCases/processSelectedFiles'
import UploadForm from './ui/UploadForm';
import SelectedImagesDisplay from './ui/SelectedImagesDisplay';
import { pipe } from 'fp-ts/lib/function';
import { TUserState } from '../auth/AuthManager/authTypes';
import { fold, map} from 'fp-ts/lib/Option'
import {axiosInstance} from '../../../core/axiosInstance';
import {fromArray} from 'fp-ts/lib/NonEmptyArray';
import * as imageReducer from '../../../core/imageReducer'
import { IDependencies } from '../../core/sharedTypes';
import {hasFileErrors} from './state/reducerUtils/hasFileErrors'
import {ReaderTaskEither} from 'fp-ts/lib/ReaderTaskEither';

interface IProps {
	user: TUserState;
}

const Uploader: React.FunctionComponent<IProps> = ({ user }) => {
	const defaultState: IImageUploadState = {
		status: 'awaitingFileSelection',
		selectedFiles: [],
	};

	const [uploadState, uploadDispatch] = React.useReducer(
		uploadReducer,
		defaultState
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		const callWithDeps = (deps: IDependencies) => (a: Function) => a(deps);

		const run = callWithDeps({fetcher: axiosInstance, dispatch: uploadDispatch, imageReducer: imageReducer.resizeImage})

		// does nothing if uploadState.selectedFiles is unpopulated
		pipe(
			uploadState.selectedFiles, 
			fromArray,
			map(processSelectedFiles),
			map(run)
		);
	};

	const handleFileRemoval = (fileName: string) =>
		uploadDispatch({ type: 'UNSELECT_FILE', data: fileName });

	const handleFileUpdate = (
		previousName: string,
		updates: Partial<IImage>
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

	const submitIsDisabled = (hasFileErrors(uploadState.selectedFiles));

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

export default Uploader;
