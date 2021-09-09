import {
	render,
	screen,
	act,
	getAllByLabelText,
	waitFor,
	logDOM,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockImageData } from './mockData';
import ImageDisplay from '../ui/ImageDisplay';
import { makeImageSearchProvider } from '../state/useImageSearchState';
import { IImageSearchState } from '../state/imageSearchStateTypes';
import { resetInternals } from 'react-use-fp';
import { mockImage4 } from './mockData';
import { renderDisplayWithFullDeps } from './imageDisplayTestUtils';
import { delay } from 'fp-ts/Task';

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

		const getDialogElement = () => screen.queryByRole('dialog');

		const imgThumbnail = screen.getByText('even more cats');

		// ensure test is valid by checking that Dialog is *closed*, i.e. not mounted
		expect(getDialogElement()).not.toBeInTheDocument();

		act(() => userEvent.click(imgThumbnail));

		expect(getDialogElement()).toBeInTheDocument();
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
			const promise = new Promise<any>((res, rej) => {
				setTimeout(() => {
					res(mockResponseData);
				}, 300);
			});

			const httpMock = {
				put: jest.fn(() => promise),
			};

			const {
				createBreakpointEdit,
				saveAllDialogChanges,
				getDialogCloseButton,
				openBreakpointsTab,
				commitBreakpointEdit,
			} = renderDisplayWithFullDeps(mockState, httpMock);

			openBreakpointsTab();

			// verify the UI
			const breakpointItems = screen.getAllByRole('listitem');
			expect(breakpointItems.length).toEqual(5);

			// these changes are irrelevant, just need to trigger a save
			// so that mock http data should be populated in app state
			createBreakpointEdit();
			commitBreakpointEdit();

			// // // trigger save
			saveAllDialogChanges();

			const x = delay(1000)(() => Promise.resolve());
			await x();

			// close the dialog
			userEvent.click(getDialogCloseButton());

			// re-open dialog
			userEvent.click(
				screen.getByText('even more cats', { exact: false })
			);

			openBreakpointsTab();

			const expectedLength =
				mockResponseData.data.breakpoints.length +
				(mockState.imageUnderConfiguration?.availableWidths
					.length as number);

			// make sure new breakpoint UI is in the dom
			const bps = await screen.getAllByRole('listitem');
			expect(bps.length).toEqual(expectedLength);
		}, 20000);
	});
});
