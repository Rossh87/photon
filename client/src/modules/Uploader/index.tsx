import React from 'react';
import { uploadReducer } from './state/uploadReducer';
import { IImage } from './domain/domainTypes';
import {IImageUploadState, TUploaderActions} from './state/uploadStateTypes'
import {preprocessImages} from './useCases/preProcessSelectedFiles'
import {processSelectedFiles} from './useCases/processSelectedFiles'
import UploadForm from './ui/UploadForm';
import SelectedImagesDisplay from './ui/SelectedImagesDisplay';
import { pipe } from 'fp-ts/lib/function';
import { TUserState } from '../auth/AuthManager/authTypes';
import { fold, map} from 'fp-ts/lib/Option'
import {hasFileErrors} from './state/reducerUtils/hasFileErrors';
import DependencyContext, {IDispatchInjector} from '../../core/dependencyContext';

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

	const depsWithoutDispatch = React.useContext<IDispatchInjector<TUploaderActions>>(DependencyContext);

	const deps = 

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
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

export default Uploader
