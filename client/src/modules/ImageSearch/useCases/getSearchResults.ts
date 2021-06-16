import { pipe, flow, Predicate } from 'fp-ts/lib/function';
import {
	TImageSearchActions,
	ISearchData,
} from '../state/imageSearchStateTypes';
import { TFetchedImageData } from '../domain/ImageSearchDomainTypes';
import { PayloadDispatchReader } from 'react-use-fp';
import { filter } from 'fp-ts/lib/Array';
import { Dispatch } from 'react';
import { IO } from 'fp-ts/lib/IO';
import { of as ROf, map as RMap, chain as RChain } from 'fp-ts/lib/Reader';

const caseInsensitiveIncludes = (searchTerm: string) => (nameOrType: string) =>
	nameOrType.toLowerCase().includes(searchTerm.toLowerCase());

const testOneImg =
	(searchTerm: string): Predicate<TFetchedImageData> =>
	(imgData) =>
		caseInsensitiveIncludes(searchTerm)(imgData.displayName) ||
		caseInsensitiveIncludes(searchTerm)(imgData.mediaType);

const filterImages = (searchData: ISearchData) =>
	pipe(searchData.imgData, filter(pipe(searchData.searchTerm, testOneImg)));

// TODO: IO type is pretty contrived here, but we need it to work correctly
// with 'react-use-fp'
const dispatchFiltered =
	(filtered: TFetchedImageData[]) =>
	(dispatch: Dispatch<TImageSearchActions>): IO<void> =>
	() =>
		dispatch({ type: 'SEARCHED_IMAGES_EMITTED', payload: filtered });

export const getSearchResults: PayloadDispatchReader<
	TImageSearchActions,
	ISearchData
> = flow(ROf, RMap(filterImages), RChain(dispatchFiltered));
