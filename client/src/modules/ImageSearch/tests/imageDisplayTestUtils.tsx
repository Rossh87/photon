import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ImageConfigurationDialog from '../ui/ImageConfigurationDialog';
import { WithMockAppState } from '../../../testUtils/renderWithMockAppState';
import mockAppState, {
	getMockImageDataOfType,
	getPopulatedImageUnderConfig,
} from '../../../testUtils/mockState';
import { IImageConfigurationState } from '../state/imageConfigurationStateTypes';
import ImageDisplay from '../ui/ImageDisplay';
import { IHTTPLib } from '../../../core/dependencyContext';

// GETTERS: helpers that return an element, and are responsible for
// manipulating component state up to the point that the needed element
// is available
const getBreakpointDiscardButton = () => {
	createBreakpointEdit();

	return screen.getByRole('button', { name: /discard/i });
};

const getBreakpointKeepButton = () => {
	createBreakpointEdit();

	return screen.getAllByTestId('bp-keep')[0];
};

const getBreakpointCreationButton = () => {
	openBreakpointsTab();

	return screen.getByRole('button', { name: /create/i });
};

const getGeneratedHTML = () => {
	openResponsiveHTMLTab();

	return screen.getByTestId('pasteable-HTML-block').innerHTML;
};

const getDialogCloseButton = () =>
	screen.getByRole('button', { name: /close-dialog/i });

// this helper does NOT perform state manipulation needed
// to ensure it's in the document
const irresponsibleGetSnackbar = async () => {
	const sb = await screen.findByTestId('dialog-snackbar');

	const assertOnTextContent = (text: string) =>
		expect(sb).toHaveTextContent(text);
	const getAbort = () => within(sb).getByTestId('snackbar-abort');
	const getProceed = () => within(sb).getByTestId('snackbar-proceed');
	const getElement = () => sb;
	const recheckForElementAsQuery = () =>
		screen.queryByTestId('dialog-snackbar');
	const recheckForElement = async () => await irresponsibleGetSnackbar();

	return {
		assertOnTextContent,
		getAbort,
		getProceed,
		getElement,
		recheckForElementAsQuery,
		recheckForElement,
	};
};

// const irresponsibleQuerySnackbar = () =>
// 	screen.queryByTestId('app-message-snackbar');

// INTERACTORS: helpers that describe/simulate a user interaction
const openBreakpointsTab = () =>
	userEvent.click(screen.getByRole('tab', { name: /breakpoint/i }));

const openResponsiveHTMLTab = () =>
	userEvent.click(screen.getByRole('tab', { name: /code/i }));

const saveAllDialogChanges = () =>
	userEvent.click(screen.getByRole('button', { name: /save/i }));

const deleteUpload = () =>
	userEvent.click(screen.getByRole('button', { name: /delete/i }));

const attemptDialogClose = () => {
	userEvent.click(getDialogCloseButton());
};

// create UNSUBMITTED edits to a breakpoint component.
// This flow assumes the dialog is already populated with mock data
// by 'render'.
const createBreakpointEdit = () => {
	openBreakpointsTab();

	// open editing form
	const editButton = screen.getAllByTestId('bp-edit')[0];
	userEvent.click(editButton);

	// make some change
	const input = screen.getAllByLabelText('media width')[0];
	userEvent.clear(input);
	userEvent.type(input, '500');
};

// commit edits to a breakpoint.
const commitBreakpointEdit = () => {
	const keepButton = getBreakpointKeepButton();
	userEvent.click(keepButton);
};

const tools = {
	getBreakpointDiscardButton,
	getBreakpointKeepButton,
	getBreakpointCreationButton,
	getGeneratedHTML,
	getDialogCloseButton,
	openBreakpointsTab,
	openResponsiveHTMLTab,
	saveAllDialogChanges,
	deleteUpload,
	attemptDialogClose,
	createBreakpointEdit,
	commitBreakpointEdit,
	irresponsibleGetSnackbar,
};

export const renderDisplayWithFullDeps = (mockFetcher?: IHTTPLib) => {
	const rendered = render(
		<WithMockAppState mockFetcher={mockFetcher}>
			<ImageDisplay />
		</WithMockAppState>
	);

	// open an image that has active breakpoints
	const underConfiguration = getMockImageDataOfType('withBreakpoints');

	const initialBreakpoints = underConfiguration.breakpoints;

	userEvent.click(screen.getByText(underConfiguration.displayName));

	return { initialBreakpoints, underConfiguration, ...tools, ...rendered };
};

export const renderDialogWithBreakpoints = () => {
	const populatedImageUnderConfiguration = getPopulatedImageUnderConfig();

	const rendered = render(
		<WithMockAppState
			mockState={{
				...mockAppState,
				imageUnderConfiguration: populatedImageUnderConfiguration,
			}}
		>
			<ImageConfigurationDialog></ImageConfigurationDialog>
		</WithMockAppState>
	);

	return { tools, ...rendered };
};

export const renderDialogWithFullDeps = (
	mockState: IImageConfigurationState
	// httpMock: any
) => {
	const rendered = render(
		<WithMockAppState
			mockState={{
				...mockAppState,
				imageUnderConfiguration: mockState,
			}}
		>
			<ImageConfigurationDialog></ImageConfigurationDialog>
		</WithMockAppState>
	);

	return { ...tools, ...rendered };
};
