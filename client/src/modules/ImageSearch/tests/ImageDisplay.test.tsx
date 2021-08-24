import { render, screen, act, getAllByLabelText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockImageData } from './mockData';
import ImageDisplay from '../ui/ImageDisplay';
import { IDBUpload } from 'sharedTypes/Upload';
import { makeImageSearchProvider } from '../state/useImageSearchState';
import { IImageSearchState } from '../state/imageSearchStateTypes';
import { resetInternals } from 'react-use-fp';

beforeEach(() => resetInternals());

describe('The ImageDisplay component', () => {
	it('renders a child image for each image selected image', () => {
		const mockData: IImageSearchState = {
			currentlyActiveImages: mockImageData,
		} as unknown as IImageSearchState;

		const MockProvider = makeImageSearchProvider(mockData);

		render(
			<MockProvider>
				<ImageDisplay />
			</MockProvider>
		);

		const images = screen.getAllByLabelText('open embed code', {
			exact: false,
		});

		expect(images.length).toEqual(mockImageData.length);
	});

	it('opens embed code configuration dialog when an image is clicked', () => {
		const mockData: IImageSearchState = {
			currentlyActiveImages: mockImageData,
		} as unknown as IImageSearchState;

		const MockProvider = makeImageSearchProvider(mockData);

		render(
			<MockProvider>
				<ImageDisplay />
			</MockProvider>
		);

		const getDialogElement = () => screen.getByRole('dialog');

		const imgThumbnail = screen.getByText('even more cats');

		// ensure test is valid by checking that Dialog is *closed*, i.e. not mounted
		expect(getDialogElement).toThrow();

		act(() => userEvent.click(imgThumbnail));

		expect(getDialogElement()).toBeTruthy();
	});
});
