import { preprocessImages } from './preProcessSelectedFiles';
import { processSelectedFiles } from './processSelectedFiles';
import { updateDisplayName } from './updateDisplayName';

export const uploaderUseCases = {
	PROCESS_FILES: processSelectedFiles,
	FILES_CHANGED: preprocessImages,
	INIT_NAME_UPDATE: updateDisplayName,
};
