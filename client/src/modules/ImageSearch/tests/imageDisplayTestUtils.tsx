// import { render, screen, within } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import '@testing-library/jest-dom';
// import { IImageSearchState } from '../state/imageSearchStateTypes';
// import ImageConfigurationDialog from '../ui/ImageConfigurationDialog';
// import DependencyContext, {
// 	createDependenciesObject,
// } from '../../../core/dependencyContext';
// import ImageDisplay from '../ui/ImageDisplay';
// import AppMessage from '../../appMeta';
// // GETTERS: helpers that return an element, and are responsible for
// // manipulating component state up to the point that the needed element
// // is available
// const getBreakpointDiscardButton = () => {
// 	createBreakpointEdit();

// 	return screen.getByRole('button', { name: /discard/i });
// };

// const getBreakpointKeepButton = () => {
// 	createBreakpointEdit();

// 	return screen.getAllByTestId('bp-keep')[0];
// };

// const getBreakpointCreationButton = () => {
// 	openBreakpointsTab();

// 	return screen.getByRole('button', { name: /create/i });
// };

// const getGeneratedHTML = () => {
// 	openResponsiveHTMLTab();

// 	return screen.getByTestId('pasteable-HTML-block').innerHTML;
// };

// const getDialogCloseButton = () =>
// 	screen.getByRole('button', { name: /close-dialog/i });

// // this helper does NOT perform state manipulation needed
// // to ensure it's in the document
// const irresponsibleGetSnackbar = async () => {
// 	const sb = await screen.findByTestId('dialog-snackbar');

// 	const assertOnTextContent = (text: string) =>
// 		expect(sb).toHaveTextContent(text);
// 	const getAbort = () => within(sb).getByTestId('snackbar-abort');
// 	const getProceed = () => within(sb).getByTestId('snackbar-proceed');
// 	const getElement = () => sb;
// 	const recheckForElementAsQuery = () =>
// 		screen.queryByTestId('dialog-snackbar');
// 	const recheckForElement = async () => await irresponsibleGetSnackbar();

// 	return {
// 		assertOnTextContent,
// 		getAbort,
// 		getProceed,
// 		getElement,
// 		recheckForElementAsQuery,
// 		recheckForElement,
// 	};
// };

// const irresponsibleQuerySnackbar = () =>
// 	screen.queryByTestId('app-message-snackbar');

// // INTERACTORS: helpers that describe/simulate a user interaction
// const openBreakpointsTab = () =>
// 	userEvent.click(screen.getByRole('tab', { name: /breakpoint/i }));

// const openResponsiveHTMLTab = () =>
// 	userEvent.click(screen.getByRole('tab', { name: /code/i }));

// const saveAllDialogChanges = () =>
// 	userEvent.click(screen.getByRole('button', { name: /save/i }));

// const deleteUpload = () =>
// 	userEvent.click(screen.getByRole('button', { name: /delete/i }));

// const attemptDialogClose = () => {
// 	userEvent.click(getDialogCloseButton());
// };

// // create UNSUBMITTED edits to a breakpoint component.
// // This flow assumes the dialog is already populated with mock data
// // by 'render'.
// const createBreakpointEdit = () => {
// 	openBreakpointsTab();

// 	// open editing form
// 	const editButton = screen.getAllByTestId('bp-edit')[0];
// 	userEvent.click(editButton);

// 	// make some change
// 	const input = screen.getAllByLabelText('media width')[0];
// 	userEvent.clear(input);
// 	userEvent.type(input, '500');
// };

// // commit edits to a breakpoint.
// const commitBreakpointEdit = () => {
// 	const keepButton = getBreakpointKeepButton();
// 	userEvent.click(keepButton);
// };

// const tools = {
// 	getBreakpointDiscardButton,
// 	getBreakpointKeepButton,
// 	getBreakpointCreationButton,
// 	getGeneratedHTML,
// 	getDialogCloseButton,
// 	openBreakpointsTab,
// 	openResponsiveHTMLTab,
// 	saveAllDialogChanges,
// 	deleteUpload,
// 	attemptDialogClose,
// 	createBreakpointEdit,
// 	commitBreakpointEdit,
// 	irresponsibleGetSnackbar,
// };

// export const renderDisplayWithFullDeps = (
// 	mockState: IImageSearchState,
// 	httpMock: any
// ) => {
// 	const makeDeps = createDependenciesObject(httpMock)(jest.fn);
// 	const MockImageSearchProvider = makeImageSearchProvider(mockState);
// 	const mockAuthState: TAuthState = {
// 		user: mockUser,
// 		appMessage: null,
// 		errors: [],
// 		demoMessageViewed: true,
// 	};

// 	render(
// 		<DependencyContext.Provider value={makeDeps}>
// 			<AuthStateContext.Provider value={mockAuthState}>
// 				<MockImageSearchProvider>
// 					<AppMessage />
// 					<ImageDisplay />
// 				</MockImageSearchProvider>
// 			</AuthStateContext.Provider>
// 		</DependencyContext.Provider>
// 	);

// 	return tools;
// };

// export const renderDialogWithBreakpoints = (mockState: IImageSearchState) => {
// 	render(
// 		<ImageSearchStateContext.Provider value={mockState}>
// 			<ImageConfigurationDialog></ImageConfigurationDialog>
// 		</ImageSearchStateContext.Provider>
// 	);

// 	return tools;
// };

// export const renderDialogWithFullDeps = (
// 	mockState: IImageSearchState,
// 	httpMock: any
// ) => {
// 	const makeDeps = createDependenciesObject(httpMock)(jest.fn);
// 	const rendered = render(
// 		<DependencyContext.Provider value={makeDeps}>
// 			<ImageSearchStateContext.Provider value={mockState}>
// 				<ImageConfigurationDialog></ImageConfigurationDialog>
// 			</ImageSearchStateContext.Provider>
// 		</DependencyContext.Provider>
// 	);

// 	return { ...tools, ...rendered };
// };

export const x = () => {};
