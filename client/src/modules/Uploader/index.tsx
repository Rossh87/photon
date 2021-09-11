import React from 'react';
import UploadForm from './ui/UploadForm';
import SelectedImagesDisplay from './ui/SelectedImagesDisplay';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import { CloseOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { canProcess } from './state/reducerUtils/canProcess';
import { map as OMap, foldW as OFoldW } from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';
import { constVoid } from 'fp-ts/lib/function';
import { identity } from 'fp-ts/lib/function';
import { useAppDispatch, useAppState } from '../appState/useAppState';

const useStyles = makeStyles({
	paper: {
		maxWidth: 936,
		margin: 'auto',
		overflow: 'hidden',
	},
});

const Uploader: React.FunctionComponent = () => {
	const classes = useStyles();

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
