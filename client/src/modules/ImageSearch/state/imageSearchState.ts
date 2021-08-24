import { Reducer } from 'react';
import {
	TImageSearchActions,
	IImageSearchState,
} from './imageSearchStateTypes';

export const defaultState: IImageSearchState = {
	imageMetadata: [],
	currentlyActiveImages: [],
	error: null,
	imageUnderConfiguration: null,
};

export const imageSearchReducer: Reducer<
	IImageSearchState,
	TImageSearchActions
> = (s, a) => {
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

		case 'SET_IMG_UNDER_CONFIGURATION':
			return {
				...s,
				imageUnderConfiguration: a.payload,
			};

		case 'CLOSE_IMG_UNDER_CONFIGURATION':
			return {
				...s,
				imageUnderConfiguration: null,
			};

		default:
			return s;
	}
};
