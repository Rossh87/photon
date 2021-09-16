import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageDisplay from '../ui/ImageDisplay';
import { IImageSearchState } from '../state/imageSearchStateTypes';
import { resetInternals } from 'react-use-fp';
import { renderDisplayWithFullDeps } from './imageDisplayTestUtils';
import { delay } from 'fp-ts/Task';
import { renderWithDefaultState } from '../../../testUtils/renderWithMockAppState';
import { getMockCurrentlyActiveImages } from '../../../testUtils/mockState';
import { IHTTPLib } from '../../../core/sharedClientTypes';

let mockState: IImageSearchState;

beforeEach(() => {
	resetInternals();
});

describe('The ImageDisplay component', () => {
	it('renders a child image for each active image', () => {
		renderWithDefaultState(<ImageDisplay />);

		const images = screen.getAllByLabelText('open embed code', {
			exact: false,
		});

		const mockActiveImages = getMockCurrentlyActiveImages();

		expect(images.length).toEqual(mockActiveImages.length);
	});

	it('opens embed code configuration dialog when an image is clicked', () => {
		renderWithDefaultState(<ImageDisplay />);

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
			const promise = new Promise<any>((res, rej) => {
				setTimeout(() => {
					res(mockResponseData);
				}, 300);
			});

			const mockAxios = {
				put: jest.fn(() => promise),
			} as unknown as IHTTPLib;

			const {
				createBreakpointEdit,
				saveAllDialogChanges,
				getDialogCloseButton,
				openBreakpointsTab,
				commitBreakpointEdit,
				initialBreakpoints,
				underConfiguration,
			} = renderDisplayWithFullDeps(mockAxios);

			const mockResponseData = {
				data: {
					...underConfiguration,
					breakpoints: [
						{
							queryType: 'min',
							mediaWidth: 800,
							slotWidth: 200,
							slotUnit: 'px',
							_id: '1234',
						},
					],
				},
			};

			openBreakpointsTab();

			// verify the UI.
			const breakpointItems = screen.getAllByRole('listitem');
			expect(breakpointItems.length).toEqual(initialBreakpoints.length);

			// these changes are irrelevant, just need to trigger a save
			// so that mock http data should be populated in app state
			createBreakpointEdit();
			commitBreakpointEdit();

			// trigger save
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

			// 1 is the number of breakpoints that was in the mock
			// response.  Make sure that's what's on screen now.
			const newBPs = await screen.getAllByRole('listitem');
			expect(newBPs.length).toEqual(1);
		}, 20000);
	});
});
