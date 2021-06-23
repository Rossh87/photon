import { Reducer } from 'react';
import {
	TImageSearchActions,
	IImageSearchState,
} from './imageSearchStateTypes';

const imageSearchReducer: Reducer<IImageSearchState, TImageSearchActions> = (
	s,
	a
) => {
	switch (a.type) {
		case 'IMG_DATA_RECEIVED':
			// on initial load, all received images are also selected
			return {
				...s,
				imageMetadata: a.payload,
				currentlyActiveImages: a.payload,
			};

		case 'SEARCHED_IMAGES_EMITTED':
			return {
				...s,
				currentlyActiveImages: a.payload,
			};

		case 'IMG_SEARCH_ERR':
			return {
				...s,
				error: a.payload,
			};

		case 'RESET_SEARCH':
			return {
				...s,
				currentlyActiveImages: s.imageMetadata,
			};

		default:
			return s;
	}
};

export default imageSearchReducer;
