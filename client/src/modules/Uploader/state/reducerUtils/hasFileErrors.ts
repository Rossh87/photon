import { TPreprocessingResults } from '../../domain/domainTypes';

export const hasFileErrors = (selectedFiles: TPreprocessingResults | []) =>
	selectedFiles.length > 0
		? selectedFiles.some(
				(file) => file.error !== undefined && file.error !== null
		  )
		: false;
