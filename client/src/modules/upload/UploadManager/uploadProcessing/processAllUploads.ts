import { processOneUpload } from './processOneUpload';
import { TPreprocessedFiles } from '../uploadPreprocessing/uploadPreprocessingTypes';
import { IAsyncUploadDependencies } from '../uploadProcessing/uploadProcessingTypes';

export const processAllUploads = (files: TPreprocessedFiles) => async (
	deps: IAsyncUploadDependencies
) => {
	// bite these off one at a time to avoid swamping client with simultaneous image resizing
	files.forEach(async (file) => await processOneUpload(file)(deps)());
};
