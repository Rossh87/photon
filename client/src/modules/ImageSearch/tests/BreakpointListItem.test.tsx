import { render, screen, act, getAllByLabelText } from '@testing-library/react';
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

const renderBP = () => render(<BreakPointListItem {...mockBP} />);

describe('BreakpointListItem component', () => {
	it('displays interactive inputs when "edit" button is clicked', () => {
		renderBP();

		const editButton = screen.getByRole('button', { name: 'Edit' });

		userEvent.click(editButton);

		const input = screen.getByLabelText('query type');

		expect(input).toBeInTheDocument();
	});

	it('displays correct buttons when component is in different states', () => {
		renderBP();

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

		render(
			<AppDispatchContext.Provider value={mockDispatch}>
				<BreakPointListItem {...mockBP} />
			</AppDispatchContext.Provider>
		);
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
