import React, { Dispatch } from 'react';
import {
	TImageSearchActions,
	IInitImageSearchAction,
} from '../state/imageSearchStateTypes';
import ImageSearchBar from '../ui/ImageSearchBar';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockImageData } from './mockData';



describe('The ImageSearchBar component', () => {
	it('dispatches correct data when input submitted via keyboard', () => {
		const dispatched: TImageSearchActions[] = [];
		const dispatch: Dispatch<TImageSearchActions> = (action) =>
			dispatched.push(action);

		const expected: IInitImageSearchAction = {
			type: 'INIT_IMG_SEARCH',
			payload: {
				imgData: mockImageData,
				searchTerm: 'bear',
			},
		};

		render(<ImageSearchBar dispatch={dispatch} imgData={mockImageData} />);

		const textInput = screen.getByRole('textbox');

		userEvent.type(textInput, 'bear{enter}');

		expect(dispatched.length).toBe(1);
		expect(dispatched[0]).toEqual(expected);
	});

	it('dispatches correct data dispatches correct data when input submitted via mouse', () => {
		const dispatched: TImageSearchActions[] = [];
		const dispatch: Dispatch<TImageSearchActions> = (action) =>
			dispatched.push(action);

		const expected: IInitImageSearchAction = {
			type: 'INIT_IMG_SEARCH',
			payload: {
				imgData: mockImageData,
				searchTerm: 'bear',
			},
		};

		render(<ImageSearchBar dispatch={dispatch} imgData={mockImageData} />);

		const textInput = screen.getByRole('textbox');
		const submitButton = screen.getByText('Search');

		userEvent.type(textInput, 'bear');
		userEvent.click(submitButton);

		expect(dispatched.length).toBe(1);
		expect(dispatched[0]).toEqual(expected);
	});

	it('does nothing if search bar text input is empty', () => {
		const dispatched: TImageSearchActions[] = [];
		const dispatch: Dispatch<TImageSearchActions> = (action) =>
			dispatched.push(action);

		render(<ImageSearchBar dispatch={dispatch} imgData={mockImageData} />);

		const submitButton = screen.getByText('Search');

		userEvent.click(submitButton);

		expect(dispatched.length).toBe(0);
	});

	it('clears search textfield after submitting a search term', () => {
		render(<ImageSearchBar dispatch={() => {}} imgData={mockImageData} />);

		const textInput = screen.getByRole('textbox') as HTMLInputElement;
		const submitButton = screen.getByText('Search');

		userEvent.type(textInput, 'bear');

		// insurance that cleared input is actually driven by code and not just
		// bungled test arrangement
		expect(textInput.value).toEqual('bear');

		userEvent.click(submitButton);

		expect(textInput.value).toEqual('');
	});
});
