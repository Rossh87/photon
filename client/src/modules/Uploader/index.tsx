import React from 'react';
import { uploadReducer } from './state/uploadReducer';
import { IImage } from './domain/domainTypes';
import {IImageUploadState, TUploaderActions} from './state/uploadStateTypes'
import {preprocessImages} from './useCases/preProcessSelectedFiles'
import {processSelectedFiles} from './useCases/processSelectedFiles'
import UploadForm from './ui/UploadForm';
import SelectedImagesDisplay from './ui/SelectedImagesDisplay';
import { pipe } from 'fp-ts/lib/function';
import { TUserState } from '../Auth/domain/authDomainTypes';
import { fold, map, ap, some} from 'fp-ts/lib/Option'
import {hasFileErrors} from './state/reducerUtils/hasFileErrors';
import DependencyContext, {IDependencies} from '../../core/dependencyContext';
import {fromArray} from 'fp-ts/lib/NonEmptyArray'

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

	const dependencies: IDependencies<TUploaderActions> = React.useContext(DependencyContext)(uploadDispatch);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// does nothing if uploadState.selectedFiles is unpopulated
		pipe(
			uploadState.selectedFiles,
			fromArray,
			map(processSelectedFiles),
			ap(some(dependencies))
		)
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
			pipe(
				preprocessImages({ ownerID })(files),
				fold(
					() => uploadDispatch({type: 'UNSELECT_ALL', data:null}),
					(images) => uploadDispatch({type: 'FILES_SELECTED', data: images})
				)
			)

			// reset file input
			e.target.value = '';
		} else {
			return;
		}
	};

	const _handleFileChange = React.useCallback(handleFileChange, [user?._id]);

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
