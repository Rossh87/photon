import theme from '../theme';
import React, { Dispatch, ReactNode, Reducer, useContext } from 'react';
import {
	authReducer,
	defaultState as defaultAuthState,
} from '../Auth/state/authState';
import {
	defaultState as defaultUploadState,
	uploadReducer,
} from '../Uploader/state/uploadReducer';
import {
	appMetaReducer,
	defaultState as defaultAppMetaState,
} from '../appMeta/appMetaState';
import {
	defaultState as defaultImagesState,
	imageSearchReducer,
} from '../ImageSearch/state/imageSearchState';
import {
	defaultState as defaultImageConfigurationState,
	imageConfigurationReducer,
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
import { StyledEngineProvider, Theme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {}
}

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

const AppProvider: React.FunctionComponent<{
	mockState?: IAppState;
	children: ReactNode;
}> = ({ children, mockState }) => {
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
		mockState ? mockState : initState,
		reducer
	);
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<AppDispatchContext.Provider value={dispatch}>
					<AppStateContext.Provider value={state}>
						<AppActionsContext.Provider value={actions}>
							{children}
						</AppActionsContext.Provider>
					</AppStateContext.Provider>
				</AppDispatchContext.Provider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};

export const useAppDispatch = () => React.useContext(AppDispatchContext);
export const useAppState = () => React.useContext(AppStateContext);
export const useAppActions = () => React.useContext(AppActionsContext);

export default AppProvider;
