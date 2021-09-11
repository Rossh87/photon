import React, { Dispatch, Reducer, useContext } from 'react';
import {
	authReducer,
	defaultState as defaultAuthState,
} from '../Auth/state/authState';
import {
	uploadReducer,
	defaultState as defaultUploadState,
} from '../Uploader/state/uploadReducer';
import {
	appMetaReducer,
	defaultState as defaultAppMetaState,
} from '../appMeta/appMetaState';
import {
	imageSearchReducer,
	defaultState as defaultImagesState,
} from '../ImageSearch/state/imageSearchState';
import {
	imageConfigurationReducer,
	defaultState as defaultImageConfigurationState,
} from '../ImageSearch/state/imageConfigurationState';
import combineReducers from 'react-combine-reducers';
import { IAppState, TAppAction } from './appStateTypes';
import { uploaderUseCases } from '../Uploader/useCases';
import {
	imageConfigUseCases,
	imagesSearchUseCases,
} from '../ImageSearch/useCases';
import DependencyContext from '../../core/dependencyContext';
import { useFPReducer } from 'react-use-fp';
import { ActionCreators } from 'react-use-fp/dist/types';
import profileUseCases from '../Profile/useCases';

export const AppStateContext: React.Context<IAppState> = React.createContext(
	{} as IAppState
);

export const AppDispatchContext: React.Context<Dispatch<TAppAction>> =
	React.createContext((() => {}) as Dispatch<TAppAction>);

const useCases = {
	...uploaderUseCases,
	...imagesSearchUseCases,
	...imageConfigUseCases,
	...profileUseCases,
};

export const AppActionsContext: React.Context<ActionCreators<typeof useCases>> =
	React.createContext((() => {}) as any);

const AppProvider: React.FunctionComponent = ({ children }) => {
	const makeDeps = useContext(DependencyContext);
	const [reducer, initState] = combineReducers({
		user: [authReducer, defaultAuthState],
		uploader: [uploadReducer, defaultUploadState],
		appMeta: [appMetaReducer, defaultAppMetaState],
		images: [imageSearchReducer, defaultImagesState],
		imageUnderConfiguration: [
			imageConfigurationReducer,
			defaultImageConfigurationState,
		],
	}) as [Reducer<IAppState, TAppAction>, IAppState];
	const [state, dispatch, actions] = useFPReducer({ ...useCases }, makeDeps)(
		initState,
		reducer
	);
	return (
		<AppDispatchContext.Provider value={dispatch}>
			<AppStateContext.Provider value={state}>
				<AppActionsContext.Provider value={actions}>
					{children}
				</AppActionsContext.Provider>
			</AppStateContext.Provider>
		</AppDispatchContext.Provider>
	);
};

export const useAppDispatch = () => React.useContext(AppDispatchContext);
export const useAppState = () => React.useContext(AppStateContext);
export const useAppActions = () => React.useContext(AppActionsContext);

export default AppProvider;
