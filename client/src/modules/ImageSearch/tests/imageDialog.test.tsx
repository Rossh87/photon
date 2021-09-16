import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';


import { WithMockAppState } from '../../../testUtils/renderWithMockAppState';
import { getMockImageDataOfType } from '../../../testUtils/mockState';
import ImageDisplay from '../ui/ImageDisplay';

const prepComponent = () => {
	render(
		<WithMockAppState>
			<ImageDisplay />
		</WithMockAppState>
	);

	const toOpen = getMockImageDataOfType('withBreakpoints');

	userEvent.click(screen.getByText(toOpen.displayName));

	userEvent.click(screen.getByRole('tab', { name: /breakpoint/i }));
};

describe('The ImageConfigurationDialog component', () => {
	it('adds a new element to the list when adder is clicked', () => {
		prepComponent();

		const breakpoints = screen.getAllByRole('listitem');

		const prevLength = breakpoints.length;

		userEvent.click(screen.getByRole('button', { name: /create/i }));

		const newLength = screen.getAllByRole('listitem').length;

		expect(newLength).toEqual(prevLength + 1);
	});

	it('can delete a breakpoint element from list', async () => {
		prepComponent();

		const beforeDeletionLength = screen.getAllByRole('listitem').length;

		const deleteButton = screen.getByLabelText('delete-breakpoint-0');

		userEvent.click(deleteButton);

		const afterDeletionLength = screen.getAllByRole('listitem');

		expect(afterDeletionLength.length).toBe(beforeDeletionLength - 1);
	});

	it('updates the pasteable HTML offered to user when a BP is added/removed', () => {
		prepComponent();

		userEvent.click(screen.getByRole('tab', { name: /code/i }));

		const beforeHTML = screen.getByTestId('pasteable-HTML-block').innerHTML;

		userEvent.click(screen.getByRole('tab', { name: /breakpoint/i }));

		const deleteButton = screen.getByLabelText('delete-breakpoint-0');

		userEvent.click(deleteButton);

		userEvent.click(screen.getByRole('tab', { name: /code/i }));

		const afterHTML = screen.getByTestId('pasteable-HTML-block').innerHTML;

		expect(beforeHTML).not.toEqual(afterHTML);
	});
});
