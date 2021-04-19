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

export const uploadReducer: React.Reducer<
	IImageUploadState,
	TUploaderActions
> = (s, a) => {
	switch (a.type) {
		case 'FILES_SELECTED':
			return { ...s, selectedFiles: a.data };

		case 'UNSELECT_ALL':
			return { ...s, selectedFiles: [] };

		case 'UNSELECT_FILE':
			return {
				...s,
				selectedFiles: filterOneImageFile(a.data)(
					s.selectedFiles as TPreprocessingResults
				),
			};
		case 'UPDATE_FILE':
			return {
				...s,
				selectedFiles: updateOneFile(
					a.previousName,
					a.data
				)(s.selectedFiles as TPreprocessingResults),
			};
		case 'INIT_UPLOAD':
			return {
				...s,
				selectedFiles: setInitiated(a.data)(
					s.selectedFiles as TPreprocessingResults
				),
			};
		case 'IMAGES_EMITTED':
			return {
				...s,
				selectedFiles: attachResizeData(a.data)(
					s.selectedFiles as TPreprocessingResults
				),
			};
		case 'UPLOAD_SUCCESS':
			return {
				...s,
				selectedFiles: setSuccessful(a.data)(
					s.selectedFiles as TPreprocessingResults
				),
			};
		case 'UPLOAD_FAILED':
			return {
				...s,
				selectedFiles: attachErrorMessage(a.data)(
					s.selectedFiles as TPreprocessingResults
				),
			};
		default:
			return s;
	}
};
