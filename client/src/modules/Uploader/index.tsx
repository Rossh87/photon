import React from 'react';
import { uploadReducer } from './state/uploadReducer';
import { IImage } from './domain/domainTypes';
import {
	IImageUploadState,
	TSelectedFilesState,
	TUploaderActions,
} from './state/uploadStateTypes';
import { preprocessImages } from './useCases/preProcessSelectedFiles';
import { processSelectedFiles } from './useCases/processSelectedFiles';
import UploadForm from './ui/UploadForm';
import SelectedImagesDisplay from './ui/SelectedImagesDisplay';
import { pipe } from 'fp-ts/lib/function';
import { TUserState } from '../Auth/domain/authDomainTypes';
import { fold } from 'fp-ts/lib/Option';
import { hasFileErrors } from './state/reducerUtils/hasFileErrors';
import DependencyContext, { IDependencies } from '../../core/dependencyContext';
import { useFPMiddleware } from 'react-use-fp';

interface IProps {
	user: TUserState;
}

const Uploader: React.FunctionComponent<IProps> = ({ user }) => {
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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('submit!');
		uploadDispatch({
			type: 'PROCESS_FILES',
			payload: uploadState.selectedFiles,
		});
	};

	const handleFileRemoval = (fileName: string) =>
		uploadDispatch({ type: 'UNSELECT_FILE', payload: fileName });

	const handleFileUpdate = (previousName: string, updates: Partial<IImage>) =>
		uploadDispatch({ type: 'UPDATE_FILE', previousName, payload: updates });

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		const ownerID = user?._id;

		if (files && ownerID) {
			pipe(
				preprocessImages({ ownerID })(files),
				fold(
					() =>
						uploadDispatch({ type: 'UNSELECT_ALL', payload: null }),
					(images) =>
						uploadDispatch({
							type: 'FILES_SELECTED',
							payload: images,
						})
				)
			);

			// reset file input
			e.target.value = '';
		} else {
			return;
		}
	};

	const _handleFileChange = React.useCallback(handleFileChange, [user?._id]);

	const acceptedExtensions = ['image/jpg', 'image/jpeg', 'image/png'];

	const submitIsDisabled = hasFileErrors(uploadState.selectedFiles);

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
