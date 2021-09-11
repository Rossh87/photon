import { fetchImageData } from '../http/fetchImageData';
import { deleteOneUpload } from './deleteUpload';
import { getSearchResults } from './getSearchResults';
import { synchronizeBreakpoints } from './synchronizeBreakpoints';

export const imagesSearchUseCases = {
	FETCH_IMG_DATA: fetchImageData,
	INIT_IMG_SEARCH: getSearchResults,
};

export const imageConfigUseCases = {
	SYNC_BREAKPOINTS: synchronizeBreakpoints,
	INIT_UPLOAD_DELETION: deleteOneUpload,
};
