import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DependencyContext, {
	createDependenciesObject,
	IHTTPLib,
	TImageResizer,
} from '../core/dependencyContext';
import { IAppState } from '../modules/appState/appStateTypes';
import { AxiosInstance } from 'axios';
import AppProvider from '../modules/appState/useAppState';

const mockResizer = jest.fn() as TImageResizer;
const mockAxios = jest.fn() as unknown as IHTTPLib;

export const renderWithMockAppState =
	(
		mockState: IAppState,
		mockFetcher: IHTTPLib = mockAxios,
		mockImgLib: TImageResizer = mockResizer
	): React.FunctionComponent =>
	({ children }) =>
		(
			<DependencyContext.Provider
				value={createDependenciesObject(mockAxios)(mockImgLib)}
			>
				<AppProvider mockState={mockState}>{children}</AppProvider>
			</DependencyContext.Provider>
		);
