import { TPreprocessingResults } from '../domain/domainTypes';
import { IImageUploadState } from './uploadStateTypes';
import React from 'react';
import { filterOneImageFile } from './reducerUtils/filterFiles';
import { updateOneFile } from './reducerUtils/updateSelectedFile';
import { attachResizeData } from './reducerUtils/attachResizeData';
import { attachErrorMessage } from './reducerUtils/attachErrorMessage';
import { setSuccessful } from './reducerUtils/setSuccessful';
import { TUploaderActions } from './uploadStateTypes';
import { setInitiated } from './reducerUtils/setInitiated';
import { none, some } from 'fp-ts/Option';
import { ILogoutUserAction } from '../../Auth/state/authStateTypes';

export const defaultState: IImageUploadState = {
	status: 'awaitingFileSelection',
	selectedFiles: [],
	componentLevelError: none,
};

export const uploadReducer: React.Reducer<
	IImageUploadState,
	TUploaderActions | ILogoutUserAction
> = (s, a) => {
	switch (a.type) {
		case 'AUTH/LOGOUT_USER':
			return { ...defaultState };

		case 'UPLOADER/FILES_SELECTED':
			return { ...s, selectedFiles: a.payload };

		case 'UPLOADER/UNSELECT_ALL':
			return { ...s, selectedFiles: [] };

		case 'UPLOADER/UNSELECT_FILE':
			return {
				...s,
				selectedFiles: filterOneImageFile(a.payload)(s.selectedFiles),
			};
		case 'UPLOADER/UPDATE_FILE':
			return {
				...s,
				selectedFiles: updateOneFile(a.payload)(
					s.selectedFiles as TPreprocessingResults
				),
			};
		case 'UPLOADER/INIT_UPLOAD':
			return {
				...s,
				selectedFiles: setInitiated(a.payload)(
					s.selectedFiles as TPreprocessingResults
				),
			};
		case 'UPLOADER/IMAGES_EMITTED':
			return {
				...s,
				selectedFiles: attachResizeData(a.payload)(
					s.selectedFiles as TPreprocessingResults
				),
			};
		case 'UPLOADER/UPLOAD_SUCCESS':
			return {
				...s,
				selectedFiles: setSuccessful(a.payload)(
					s.selectedFiles as TPreprocessingResults
				),
			};
		case 'UPLOADER/UPLOAD_FAILED':
			return {
				...s,
				selectedFiles: attachErrorMessage(a.payload)(
					s.selectedFiles as TPreprocessingResults
				),
			};
		case 'UPLOADER/UPLOAD_COMPONENT_ERR':
			return {
				...s,
				componentLevelError: some(a.payload),
			};
		case 'UPLOADER/CLEAR_UPLOAD_COMPONENT_ERR':
			return {
				...s,
				componentLevelError: none,
			};
		default:
			return s;
	}
};
