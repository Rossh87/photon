import {
	render,
	screen,
	act,
	getAllByLabelText,
	waitFor,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { IImageSearchState } from '../state/imageSearchStateTypes';
import { resetInternals } from 'react-use-fp';
import { mockImage4, mockImage3, mockImageData } from './mockData';
import { ImageSearchStateContext } from '../state/useImageSearchState';
import ImageDialog from '../ui/ImageDialog';
import DependencyContext, {
	createDependenciesObject,
} from '../../../core/dependencyContext';
import { IBreakpointTransferObject } from '../../../../../sharedTypes/Upload';

const _mockState: IImageSearchState = {
	imageMetadata: mockImageData,
	currentlyActiveImages: [],
	error: null,
	imageUnderConfiguration: mockImage4,
};

let mockState: IImageSearchState;

beforeEach(() => {
	resetInternals();

	mockState = Object.assign({}, _mockState);
	mockState.imageUnderConfiguration = Object.assign({}, mockImage4);
});

const renderWithBreakpoints = () =>
	render(
		<ImageSearchStateContext.Provider value={mockState}>
			<ImageDialog></ImageDialog>
		</ImageSearchStateContext.Provider>
	);

const renderWithFullDeps = (httpMock: any) => {
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
const desyncComponent = () => {
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

describe('The ImageDialog component', () => {
	it('generates correct number of each kind of breakpoint child', async () => {
		renderWithBreakpoints();

		// check for UI to create a new breakpoint
		const createChild = await screen.findAllByText('create a new query', {
			exact: false,
		});
		expect(createChild.length).toBe(1);

		// check for UI from user-defined breakpoints.  It's important
		// that mock data not have user-defined BPs of same width as
		// an available size, to avoid testing conflicts
		const userBreakpoints = await screen.getAllByTestId(
			'breakpoint-item-user'
		);
		expect(userBreakpoints.length).toBe(2);

		// check for default breakpoints created from available widths.  Mockimage4 has 3.
		const defaults = screen.getAllByText('generated by default', {
			exact: false,
		});
		expect(defaults.length).toBe(3);
	});

	it('adds a new element to the list when adder is clicked', () => {
		// select an image under config that has no user-defined
		// breakpoints
		mockState.imageUnderConfiguration = mockImage3;
		render(
			<ImageSearchStateContext.Provider value={mockState}>
				<ImageDialog></ImageDialog>
			</ImageSearchStateContext.Provider>
		);

		const adder = screen.getByText('Create a new query');

		// make sure click is actually causing the desired effect
		const defaultBreakpoints = screen.getAllByText('max-width');
		const defaultCount = defaultBreakpoints.length;

		userEvent.click(adder);

		const withNew = screen.getAllByText('max-width');
		expect(withNew.length).toBe(defaultCount + 1);
	});

	it('can delete a breakpoint element from list', () => {
		renderWithBreakpoints();

		const breakpointItems = screen.getAllByRole('listitem');
		expect(breakpointItems.length).toBe(6);

		const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
		expect(deleteButtons.length).toBe(2);

		userEvent.click(deleteButtons[0]);

		expect(screen.getAllByRole('listitem').length).toBe(
			breakpointItems.length - 1
		);
	});

	it('updates the pasteable HTML offered to user when a BP is added/removed', () => {
		renderWithBreakpoints();

		const htmlBefore = screen.getByTestId('pasteable-HTML-block').innerHTML;

		const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });

		userEvent.click(deleteButtons[0]);

		const htmlAfter = screen.getByTestId('pasteable-HTML-block').innerHTML;

		expect(htmlBefore).not.toEqual(htmlAfter);
	});

	describe('when attempting to close the dialog', () => {
		it('prompts user to save when they close modal with unsaved changes', async () => {
			renderWithBreakpoints();
			desyncComponent();

			const exitButton = screen.getByRole('button', { name: 'close' });

			act(() => userEvent.click(exitButton));

			const warningSnackbar = screen.getByText('Are you sure', {
				exact: false,
			});

			expect(warningSnackbar).toBeInTheDocument();
		});

		it('closes if there are no unsaved changes', () => {
			renderWithBreakpoints();

			const exitButton = screen.getByRole('button', { name: 'close' });
			userEvent.click(exitButton);

			const warningSnackbar = screen.queryByText('Are you sure', {
				exact: false,
			});

			expect(warningSnackbar).not.toBeInTheDocument();
		});

		it('shows err message when updating breakpoints with server fails', async () => {
			let submittedData: IBreakpointTransferObject;

			const httpMock = {
				put: jest.fn((path, data) => {
					submittedData = data;

					return new Promise<void>((res, rej) => {
						setTimeout(() => {
							rej('some kind of server problem');
						}, 300);
					});
				}),
			};

			renderWithFullDeps(httpMock);

			desyncComponent();

			// trigger the err
			const saveButton = screen.getByRole('button', { name: 'Save' });
			userEvent.click(saveButton);

			// verify the UI
			const errSnackbar = await screen.findByText(
				'Attempt to update image breakpoint data failed',
				{ exact: false }
			);
			expect(errSnackbar).toBeInTheDocument();

			// verify the sent data
			//@ts-ignore
			expect(submittedData).toEqual({
				imageID: '128796',
				breakpoints: [
					// note this includes edits from the desync function above
					{
						queryType: 'min',
						mediaWidth: 50,
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
				],
			});

			// ensure we can close the err snackbar
			const closeSnackbarButton = screen.getByRole('button', {
				name: 'close-snackbar',
			});
			userEvent.click(closeSnackbarButton);
			expect(
				screen.queryByText(
					'Attempt to update image breakpoint data failed',
					{ exact: false }
				)
			).not.toBeInTheDocument();

			// now ensure the err snackbar will REOPEN if another problem surfaces
			userEvent.click(saveButton);
			const snackedAgain = await screen.findByText(
				'Attempt to update image breakpoint data failed',
				{ exact: false }
			);
			expect(snackedAgain).toBeInTheDocument();
		}, 20000);
	}),
		it.only('shows success message when updating breakpoints with server succeeds', async () => {
			// No need to check submitted data--above test does that
			const httpMock = {
				put: jest.fn(() => {
					return new Promise<void>((res, rej) => {
						setTimeout(() => {
							console.log('resolved!');
							res();
						}, 300);
					});
				}),
			};

			renderWithFullDeps(httpMock);

			desyncComponent();

			// trigger save
			const saveButton = screen.getByRole('button', { name: 'Save' });
			userEvent.click(saveButton);

			// verify the UI
			const successSnackbar = await screen.findByText(
				'submission successful',
				{ exact: false }
			);
			expect(successSnackbar).toBeInTheDocument();

			// ensure snackbar times out on its own
			await waitForElementToBeRemoved(successSnackbar, {
				timeout: 2200,
			});

			expect(
				screen.queryByText('submission successful', { exact: false })
			).not.toBeInTheDocument();
		}, 20000);
});
