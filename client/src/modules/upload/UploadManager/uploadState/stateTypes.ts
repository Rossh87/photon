import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import {
	TPreprocessedFiles,
	TPreprocessErrors,
} from '../uploadPreprocessing/uploadPreprocessingTypes';
import { TUploadProcessingErrors } from '../uploadProcessing/uploadProcessingTypes';

import { UploadError } from '../uploadProcessing/UploadError';

// Begin image preprocessing types
export type TFilesArray = NonEmptyArray<File>;

export type TImageUploadStateStatus =
	| 'awaitingFileSelection'
	| 'validatingSelectedFiles'
	| 'preparingFilesForUpload'
	| 'uploading'
	| 'success'
	| 'failed';

export interface IImageUploadState {
	status: TImageUploadStateStatus;
	selectedFiles: TPreprocessedFiles | [];
	errors: TPreprocessErrors | TUploadProcessingErrors | [];
}
