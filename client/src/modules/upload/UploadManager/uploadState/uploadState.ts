import { TPreprocessingResults } from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
import { IImageUploadState } from './stateTypes';
import { copy } from 'fp-ts/lib/NonEmptyArray';
import React from 'react';
import { filterOneImageFile } from './filterFiles';
import { updateOneFile } from './updateSelectedFile';
import { TPreprocessActions } from './stateTypes';

// NEEDED: upload_failed, upload_init_failed, upload_success

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
		// case 'UPDATE_FILE':
		// 	return {
		// 		...s,
		// 		selectedFiles: updateOneFile(
		// 			a.previousName,
		// 			a.data
		// 		)(s.selectedFiles as TPreprocessedFiles),
		// 	};
		default:
			return s;
	}
};
