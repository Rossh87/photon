import React, { useContext, Dispatch } from 'react';
import dependencyContext from '../../../core/dependencyContext';
import { imageSearchReducer, defaultState } from './imageSearchState';
import {
	IImageSearchState,
	TImageSearchActions,
} from './imageSearchStateTypes';
import { useFPReducer } from 'react-use-fp';
import { fetchImageData } from '../http/fetchImageData';
import { getSearchResults } from '../useCases/getSearchResults';

// We cast the context types because we need to initialize them *outside* of the component
// to be able to provide the contexts in separate hooks
export const ImageSearchStateContext: React.Context<IImageSearchState> =
	React.createContext(defaultState);

export const ImageSearchDispatchContext: React.Context<
	Dispatch<TImageSearchActions>
> = React.createContext(
	((a: TImageSearchActions) => null) as Dispatch<TImageSearchActions>
);

export const ImageSearchActionsContext: React.Context<{}> = React.createContext(
	{}
);

// allows us to pass in any mock data we want for tests
export const makeImageSearchProvider =
	(
		initState: IImageSearchState,
		makeDependencies?: (a: any) => any,
		observer?: (a: any) => void
	): React.FunctionComponent =>
	({ children }) => {
		// NB that this depends on having DependencyContext.Provider higher in the component tree.
		// Since dependencies will never change, shouldn't cause any problems to mount that provider
		// at the very highest level
		const makeDeps = makeDependencies
			? makeDependencies
			: useContext(dependencyContext);

		const [imageSearchState, imageSearchDispatch, actions] = useFPReducer(
			{
				FETCH_IMG_DATA: fetchImageData,
				INIT_IMG_SEARCH: getSearchResults,
			},
			makeDeps
		)(initState, imageSearchReducer);

		return (
			<ImageSearchDispatchContext.Provider value={imageSearchDispatch}>
				<ImageSearchStateContext.Provider value={imageSearchState}>
					<ImageSearchActionsContext.Provider value={actions}>
						{children}
					</ImageSearchActionsContext.Provider>
				</ImageSearchStateContext.Provider>
			</ImageSearchDispatchContext.Provider>
		);
	};

// hooks for use in components
export const useImageSearchDispatch = () =>
	React.useContext(ImageSearchDispatchContext);

export const useImageSearchState = () =>
	React.useContext(ImageSearchStateContext);

export const useImageSearchActions = () =>
	React.useContext(ImageSearchActionsContext);

// 'real' provider component
const ImageSearchProvider = makeImageSearchProvider(defaultState);
export default ImageSearchProvider;
