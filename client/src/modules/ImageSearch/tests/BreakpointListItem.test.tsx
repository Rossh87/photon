import BreakPointListIte from '../ui/BreakPointListItem';
import { render, screen, act, getAllByLabelText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ImageDisplay from '../ui/ImageDisplay';
import { IClientUpload } from 'sharedTypes/Upload';
import { makeImageSearchProvider } from '../state/useImageSearchState';
import { IImageSearchState } from '../state/imageSearchStateTypes';
import { resetInternals } from 'react-use-fp';
import DependencyContext, {
	createDependenciesObject,
} from '../../../core/dependencyContext';
import { mockBreakpointData, mockImage3, mockImageData } from './mockData';
import { ImageSearchStateContext } from '../state/useImageSearchState';
import ImageConfigurationDialog from '../ui/ImageConfigurationDialog';
import BreakPointListItem from '../ui/BreakPointListItem';
import {
	TBreakpointUI,
	TUserBreakpointUI,
} from '../state/imageConfigurationStateTypes';

// creating a new breakpoint:
// 1. generate a UID for bp--only needs to be unique amongst its siblings
// 2. populate with defaults.  'editing' status is true, accordion UI is open
// 3. accordion cannot be closed while bp is in editing mode
// 4. submit the updates by clicking button at right side of UI.  At this point,
// embed code should update
// 5. The new element needs a prop to know if it's new or not.  If it's new, discarding
// should remove it from the UI.  If it's an edit, discarding keeps it in the UI with unmodified values

let mockBP: TUserBreakpointUI;

beforeEach(() => {
	mockBP = Object.assign({}, mockBreakpointData);
});

const renderWithData = (fn?: (a: any) => void) =>
	render(<BreakPointListItem dispatch={fn || jest.fn()} {...mockBP} />);

describe('BreakpointListItem component', () => {
	it('displays interactive inputs when "edit" button is clicked', () => {
		renderWithData();

		const editButton = screen.getByRole('button', { name: 'Edit' });

		userEvent.click(editButton);

		const input = screen.getByLabelText('query type');

		expect(input).toBeInTheDocument();
	});

	it('displays correct buttons when component is in different states', () => {
		renderWithData();

		// open editing menu
		const editButton = screen.getByRole('button', { name: 'Edit' });
		userEvent.click(editButton);

		// No edits, so close button is displayed
		const closeButton = screen.getByRole('button', { name: 'Close' });
		expect(closeButton).toBeInTheDocument();

		// Now make an edit
		const queryWidthInput = screen.getByLabelText('media width');
		userEvent.type(queryWidthInput, '222');

		const discardButton = screen.getByRole('button', { name: 'Discard' });
		const keepButton = screen.getByRole('button', { name: 'Keep' });
		expect(discardButton).toBeInTheDocument();
		expect(keepButton).toBeInTheDocument();
	});

	it('submits accurate data when "Keep" is clicked', async () => {
		const dispatched: any[] = [];
		const mockDispatch = (a: any) => dispatched.push(a);
		renderWithData(mockDispatch);

		// open editing menu
		const editButton = screen.getByRole('button', { name: 'Edit' });
		userEvent.click(editButton);

		// edit
		const queryWidthInput = screen.getByLabelText('media width');
		userEvent.clear(queryWidthInput);
		userEvent.type(queryWidthInput, '22');

		const keepButton = screen.getByRole('button', { name: 'Keep' });
		userEvent.click(keepButton);

		const expectedData = Object.assign({}, mockBP, {
			editing: false,
			mediaWidth: 22,
		});

		expect(dispatched[0].payload).toEqual(expectedData);
	});
});
