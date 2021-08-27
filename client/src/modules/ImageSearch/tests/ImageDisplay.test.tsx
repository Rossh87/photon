import {
	render,
	screen,
	act,
	getAllByLabelText,
	waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockImageData } from './mockData';
import ImageDisplay from '../ui/ImageDisplay';
import { IDBUpload } from 'sharedTypes/Upload';
import { makeImageSearchProvider } from '../state/useImageSearchState';
import { IImageSearchState } from '../state/imageSearchStateTypes';
import { resetInternals } from 'react-use-fp';
import { mockImage4 } from './mockData';
import {
	desyncDialogComponent,
	renderDisplayWithFullDeps,
} from './imageDisplayTestUtils';
import { delay } from 'fp-ts/lib/Task';

const _mockState: IImageSearchState = {
	imageMetadata: [...mockImageData],
	currentlyActiveImages: [...mockImageData],
	error: null,
	imageUnderConfiguration: mockImage4,
};

let mockState: IImageSearchState;

beforeEach(() => {
	resetInternals();

	mockState = Object.assign({}, _mockState);
	mockState.imageUnderConfiguration = Object.assign({}, mockImage4);
});

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

	describe('when breakpoints are updated and the dialog is closed and reopened', () => {
		it('shows most recent updates when re-opened', async () => {
			// no need to apply any particular updates on first open, just verify that
			// whatever is in the JSON response is applied on re-open
			const mockResponseData = {
				data: {
					...mockImage4,
					breakpoints: [
						{
							queryType: 'min',
							mediaWidth: 800,
							slotWidth: 200,
							slotUnit: 'px',
							_id: '1234',
						},
						{
							queryType: 'max',
							mediaWidth: 1150,
							slotWidth: 600,
							slotUnit: 'vw',
							_id: '5678',
						},
						{
							queryType: 'max',
							mediaWidth: 1000,
							slotWidth: 600,
							slotUnit: 'vw',
							_id: 'kk27',
						},
						{
							queryType: 'max',
							mediaWidth: 1150,
							slotWidth: 600,
							slotUnit: 'vw',
							_id: '44g3',
						},
					],
				},
			};
			const httpMock = {
				put: jest.fn(() => {
					return new Promise<any>((res, rej) => {
						setTimeout(() => {
							console.log('resolved!');
							res(mockResponseData);
						}, 300);
					});
				}),
			};

			renderDisplayWithFullDeps(mockState, httpMock);

			// open the image
			const thumbnail = screen.getByText('even more cats');
			userEvent.click(thumbnail);

			// verify the UI
			const breakpointItems = screen.getAllByRole('listitem');
			expect(breakpointItems.length).toEqual(6);

			// these changes are irrelevant, just need to trigger a save
			desyncDialogComponent();

			// trigger save
			const saveButton = screen.getByRole('button', { name: 'Save' });
			userEvent.click(saveButton);

			const x = delay(1000)(() => Promise.resolve());
			await x();
			// close the dialog
			const closeButton = screen.getByRole('button', { name: 'close' });
			userEvent.click(closeButton);

			// re-open dialog
			userEvent.click(thumbnail);

			// make sure new breakpoint UI is in the dom
			const bps = await screen.getAllByRole('listitem');
			expect(bps.length).toEqual(8);
		}, 20000);
	});

	it('does not show unsaved updates when reopened', async () => {
		renderDisplayWithFullDeps(mockState, {});

		// open the image
		const thumbnail = screen.getByText('even more cats');
		userEvent.click(thumbnail);

		// verify the UI
		const breakpointItems = screen.getAllByRole('listitem');
		expect(breakpointItems.length).toEqual(6);

		desyncDialogComponent();

		// close the dialog
		const closeButton = screen.getByRole('button', { name: 'close' });
		userEvent.click(closeButton);

		// confirm the close in snackbar
		const reallyClose = screen.getByRole('button', { name: 'Discard' });
		userEvent.click(reallyClose);

		// re-open dialog
		userEvent.click(thumbnail);

		// make sure new breakpoint UI is in the dom
		const bps = await screen.getAllByRole('listitem');
		expect(bps.length).toEqual(6);
	}, 20000);
});
