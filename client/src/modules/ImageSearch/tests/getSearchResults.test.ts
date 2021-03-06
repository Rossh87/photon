import { getSearchResults } from '../useCases/getSearchResults';
import { mockImageData, mockImage1, mockImage3, mockImage4 } from './mockData';
import {
	TImageSearchActions,
	ISearchedImagesEmittedAction,
	ISearchData,
} from '../state/imageSearchStateTypes';
import { Dispatch } from 'react';

describe('searching users image data', () => {
	it('filters out non-matching images', () => {
		const dispatched: TImageSearchActions[] = [];
		const dispatch: Dispatch<TImageSearchActions> = (action) =>
			dispatched.push(action);

		const searchData: ISearchData = {
			searchTerm: 'Alps',
			imgData: mockImageData,
		};

		const expected: ISearchedImagesEmittedAction = {
			type: 'SEARCHED_IMAGES_EMITTED',
			payload: [Object.assign({}, mockImage1)],
		};

		getSearchResults(searchData)(dispatch)();

		expect(dispatched.length).toBe(1);
		expect(dispatched[0]).toEqual(expected);
	});

	it('is not case-sensitive', () => {
		const dispatched: TImageSearchActions[] = [];
		const dispatch: Dispatch<TImageSearchActions> = (action) =>
			dispatched.push(action);

		const searchData: ISearchData = {
			searchTerm: 'alps',
			imgData: mockImageData,
		};

		const expected: ISearchedImagesEmittedAction = {
			type: 'SEARCHED_IMAGES_EMITTED',
			payload: [Object.assign({}, mockImage1)],
		};

		getSearchResults(searchData)(dispatch)();

		expect(dispatched.length).toBe(1);
		expect(dispatched[0]).toEqual(expected);
	});

	it('can return multiple results', () => {
		const dispatched: TImageSearchActions[] = [];
		const dispatch: Dispatch<TImageSearchActions> = (action) =>
			dispatched.push(action);

		const searchData: ISearchData = {
			searchTerm: 'cats',
			imgData: mockImageData,
		};

		const expected: ISearchedImagesEmittedAction = {
			type: 'SEARCHED_IMAGES_EMITTED',
			payload: [
				Object.assign({}, mockImage3),
				Object.assign({}, mockImage4),
			],
		};

		getSearchResults(searchData)(dispatch)();

		expect(dispatched.length).toBe(1);
		expect(dispatched[0]).toEqual(expected);
	});
});
