import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import DependencyContext, {
	IHTTPLib,
	TImageResizer,
	createDependenciesObject,
} from '../core/dependencyContext';
import { IAppState } from '../modules/appState/appStateTypes';
import AppProvider from '../modules/appState/useAppState';
import mockAppState from './mockState';
import React, { FunctionComponent, ReactNode } from 'react';

const mockResizer = jest.fn() as TImageResizer;
const mockAxios = jest.fn() as unknown as IHTTPLib;

interface MockWrapperProps {
	mockState?: IAppState;
	mockFetcher?: IHTTPLib;
	mockImgLib?: TImageResizer;
	children?: ReactNode;
}

export const WithMockAppState: FunctionComponent<MockWrapperProps> = ({
	children,
	mockState = mockAppState,
	mockFetcher = mockAxios,
	mockImgLib = mockResizer,
}) => (
	<DependencyContext.Provider
		value={createDependenciesObject(mockFetcher)(mockImgLib)}
	>
		<AppProvider mockState={mockState}>{children}</AppProvider>
	</DependencyContext.Provider>
);

export const renderWithDefaultState = (JSXComponentTree: React.ReactElement) =>
	render(<WithMockAppState>{JSXComponentTree}</WithMockAppState>);
