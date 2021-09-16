import { Reducer } from 'react';
import { deleteImageMetadata } from '../helpers/deleteImageMetadata';
import { SyncSuccessAction } from './imageConfigurationStateTypes';
import {
	TImageSearchActions,
	IImageSearchState,
} from './imageSearchStateTypes';

export const defaultState: IImageSearchState = {
	imageMetadata: [],
	currentlyActiveImages: [],
};

export const imageSearchReducer: Reducer<
	IImageSearchState,
	TImageSearchActions | SyncSuccessAction
> = (s, a) => {
	switch (a.type) {
		// actions that hit multiple dispatchers:
		case 'IMAGE_CONFIG/BREAKPOINT_SYNC_SUCCESS':
			return {
				...s,
				imageMetadata: s.imageMetadata.map((img) =>
					img._id === a.payload.imageID
						? { ...img, breakpoints: a.payload.breakpoints }
						: img
				),
				currentlyActiveImages: s.currentlyActiveImages.map((img) =>
					img._id === a.payload.imageID
						? { ...img, breakpoints: a.payload.breakpoints }
						: img
				),
			};

		// Regular cases
		case 'IMAGES/IMG_DATA_RECEIVED':
			// on initial load, all received images are also selected
			return {
				...s,
				imageMetadata: a.payload,
				currentlyActiveImages: a.payload,
			};

		case 'IMAGES/SEARCHED_IMAGES_EMITTED':
			return {
				...s,
				currentlyActiveImages: a.payload,
			};

		case 'IMAGES/IMG_SEARCH_ERR':
			return {
				...s,
				error: a.payload,
			};

		case 'IMAGES/RESET_SEARCH':
			return {
				...s,
				currentlyActiveImages: s.imageMetadata,
			};

		// case 'IMAGES/CLOSE_IMG_UNDER_CONFIGURATION':
		// 	if (a.payload) {
		// 		const updater = applyBreakpointToImages(a.payload);
		// 		return {
		// 			...s,
		// 			imageUnderConfiguration: null,
		// 			imageMetadata: updater(s.imageMetadata),
		// 			currentlyActiveImages: updater(s.currentlyActiveImages),
		// 		};
		// 	} else {
		// 		return {
		// 			...s,
		// 			imageUnderConfiguration: null,
		// 		};
		// 	}
		case 'IMAGES/DELETE_IMAGE':
			return {
				...s,
				imageMetadata: deleteImageMetadata(a.payload)(s.imageMetadata),
				currentlyActiveImages: deleteImageMetadata(a.payload)(
					s.currentlyActiveImages
				),
			};

		default:
			return s;
	}
};
