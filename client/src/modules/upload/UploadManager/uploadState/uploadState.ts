import { TPreprocessingResults } from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
import { IImageUploadState } from './stateTypes';
import { copy } from 'fp-ts/lib/NonEmptyArray';
import React from 'react';
import { filterOneImageFile } from './filterFiles';
import { updateOneFile } from './updateSelectedFile';
import { attachResizeData } from './attachResizeData';
import { attachErrorMessage } from './attachErrorMessage';
import { setSuccessful } from './setSuccessful';
import { hasFileErrors } from './hasFileErrors';
import { TPreprocessActions } from './stateTypes';

export const uploadReducer: React.Reducer<
	IImageUploadState,
	TPreprocessActions
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
