import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BreakPointListItem from '../ui/BreakPointListItem';
import { ISavedBreakpoint } from '../../../../../sharedTypes/Breakpoint';
import { AppDispatchContext } from '../../appState/useAppState';

let mockBP: ISavedBreakpoint = {
	queryType: 'max',
	mediaWidth: 200,
	slotWidth: 700,
	slotUnit: 'px',
	_id: '12345',
};

beforeEach(() => {
	mockBP = Object.assign({}, mockBP);
});

const renderBP = () => render(<BreakPointListItem {...mockBP} position={1} />);

describe('BreakpointListItem component', () => {
	it('displays interactive inputs when "edit" button is clicked', () => {
		renderBP();

		const editButton = screen.getByLabelText('edit-breakpoint-1');

		userEvent.click(editButton);

		const input = screen.getByLabelText('query type');

		expect(input).toBeInTheDocument();
	});

	it('displays correct buttons when component is in different states', () => {
		renderBP();

		// open editing menu
		const editButton = screen.getByLabelText('edit-breakpoint-1');
		userEvent.click(editButton);

		// No edits, so close button is displayed
		screen.getByLabelText('close-breakpoint-1');

		// Now make an edit
		const queryWidthInput = screen.getByLabelText('media width');
		userEvent.type(queryWidthInput, '222');

		screen.getByLabelText('discard-breakpoint-edits-1');
		screen.getByLabelText('keep-breakpoint-edits-1');
	});

	it('submits accurate data when "Keep" is clicked', async () => {
		const dispatched: any[] = [];
		const mockDispatch = (a: any) => dispatched.push(a);

		render(
			<AppDispatchContext.Provider value={mockDispatch}>
				<BreakPointListItem {...mockBP} position={1} />
			</AppDispatchContext.Provider>
		);
		// open editing menu
		const editButton = screen.getByLabelText('edit-breakpoint-1');
		userEvent.click(editButton);

		// edit
		const queryWidthInput = screen.getByLabelText('media width');
		userEvent.clear(queryWidthInput);
		userEvent.type(queryWidthInput, '22');

		const keepButton = screen.getByLabelText('keep-breakpoint-edits-1');
		userEvent.click(keepButton);

		const expectedAction = {
			type: 'IMAGE_CONFIG/UPDATE_ONE_BREAKPOINT',
			payload: Object.assign({}, mockBP, {
				mediaWidth: 22,
			}),
		};

		expect(dispatched[0]).toEqual(expectedAction);
	});
});
