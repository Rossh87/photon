import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { IImageSearchState } from '../state/imageSearchStateTypes';
import { resetInternals } from 'react-use-fp';
import { mockImage4, mockImageData } from './mockData';
import {
	ImageSearchStateContext,
	makeImageSearchProvider,
} from '../state/useImageSearchState';
import ImageDialog from '../ui/ImageDialog';
import DependencyContext, {
	createDependenciesObject,
} from '../../../core/dependencyContext';
import ImageDisplay from '../ui/ImageDisplay';

export const renderDialogWithBreakpoints = (mockState: IImageSearchState) =>
	render(
		<ImageSearchStateContext.Provider value={mockState}>
			<ImageDialog></ImageDialog>
		</ImageSearchStateContext.Provider>
	);

export const renderDialogWithFullDeps = (
	mockState: IImageSearchState,
	httpMock: any
) => {
	const makeDeps = createDependenciesObject(httpMock)(jest.fn);
	render(
		<DependencyContext.Provider value={makeDeps}>
			<ImageSearchStateContext.Provider value={mockState}>
				<ImageDialog></ImageDialog>
			</ImageSearchStateContext.Provider>
		</DependencyContext.Provider>
	);
};

// create some unsaved changes to the component state.
// NEVER FUCKING TOUCH THIS YOU WILL WISH YOU HADN'T
export const desyncDialogComponent = () => {
	// open editing form
	const editButton = screen.getAllByRole('button', { name: 'Edit' })[0];
	userEvent.click(editButton);

	// make some change
	const input = screen.getAllByLabelText('media width')[0];
	userEvent.clear(input);
	userEvent.type(input, '500');

	// add the change
	const keepButton = screen.getAllByRole('button', { name: 'Keep' })[0];
	userEvent.click(keepButton);
};

export const renderDisplayWithFullDeps = (
	mockState: IImageSearchState,
	httpMock: any
) => {
	const makeDeps = createDependenciesObject(httpMock)(jest.fn);
	const MockProvider = makeImageSearchProvider(mockState);

	render(
		<DependencyContext.Provider value={makeDeps}>
			<MockProvider>
				<ImageDisplay />
			</MockProvider>
		</DependencyContext.Provider>
	);
};
