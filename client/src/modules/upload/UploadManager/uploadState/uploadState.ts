import {
	TPreprocessActions,
	TPreprocessedFiles,
	TPreprocessErrors,
} from '../uploadPreprocessing/uploadPreprocessingTypes';
import { IImageUploadState } from './stateTypes';
import { copy } from 'fp-ts/lib/NonEmptyArray';
import React from 'react';
import { filterOneError, filterOneFile } from './filterFiles';
import { updateOneFile } from './updateSelectedFile';
import {
	TUploadActions,
	TUploadProcessingErrors,
} from '../uploadProcessing/uploadProcessingTypes';
import { UploadError } from '../uploadProcessing/UploadError';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

// NEEDED: upload_failed, upload_init_failed, upload_success

export const uploadReducer: React.Reducer<
	IImageUploadState,
	TPreprocessActions | TUploadActions
> = (s, a) => {
	switch (a.type) {
		case 'FILES_SELECTED':
			return { ...s, selectedFiles: a.data };
		case 'INVALID_FILE_SELECTIONS':
			return {
				...s,
				errors: copy(a.data),
			};
		case 'UNSELECT_INVALID_FILE':
			return {
				...s,
				errors: filterOneError(a.data)(s.errors as TPreprocessErrors),
			};
		case 'UNSELECT_VALID_FILE':
			return {
				...s,
				selectedFiles: filterOneFile(a.data)(
					s.selectedFiles as TPreprocessedFiles
				),
			};
		case 'UPDATE_FILE':
			return {
				...s,
				selectedFiles: updateOneFile(
					a.previousName,
					a.data
				)(s.selectedFiles as TPreprocessedFiles),
			};
		case 'UPLOAD_FAILED':
			return {
				...s,
				errors: [...s.errors, a.data] as TUploadProcessingErrors,
			};
		case 'UPLOAD_SUCCESS':
			return {
				...s,
				selectedFiles: filterOneFile(a.data)(
					s.selectedFiles as TPreprocessedFiles
				),
			};

		default:
			return s;
	}
};
