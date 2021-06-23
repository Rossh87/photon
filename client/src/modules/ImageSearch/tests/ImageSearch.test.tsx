import React, { Dispatch } from 'react';
import { AuthStateContext } from '../../Auth/state/useAuthState';
import { TImageSearchActions } from '../state/imageSearchStateTypes';
import { IAuthState } from '../../Auth/state/authStateTypes';
import ImageSearch from '../index';
import { render, fireEvent, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockImageData } from './mockData';
import { getOversizeImageFile } from '../../../testUtils/imageUtils';
import DependencyContext, {
	IDependencies,
} from '../../../core/dependencyContext';
import { REQUEST_USER_IMG_DATA_ENDPOINT } from '../http/endpoints';

const renderComponentWithMockFetch = (http: any) =>
	render(
		<DependencyContext.Provider
			value={(dispatch: Dispatch<any>) => ({
				http: (fn: any) => fn(http),
				dispatch,
				// unused by this component
				imageReducer: jest.fn(),
			})}
		>
			<ImageSearch />
		</DependencyContext.Provider>
	);

describe('The ImageSearch component', () => {
	describe('intial image loading', () => {
		it('requests data from correct URL on mount', async () => {
			const httpMock = {
				get: jest.fn(
					() =>
						new Promise((res) =>
							res({
								data: mockImageData,
							})
						)
				),
			};

			await act(async () => {
				renderComponentWithMockFetch(httpMock);
			});

			expect(httpMock.get).toHaveBeenCalledWith(
				REQUEST_USER_IMG_DATA_ENDPOINT,
				{ withCredentials: true }
			);
		});

		it('displays one image card for each image data loaded', async () => {
			const httpMock = {
				get: jest.fn(
					() =>
						new Promise((res) =>
							res({
								data: mockImageData,
							})
						)
				),
			};

			await act(async () => {
				renderComponentWithMockFetch(httpMock);
			});

			const firstImage = screen.getAllByRole('img');

			// length should be equal to number of elements in mock data array.
			// Test will break if mock data length changes.
			expect(firstImage.length).toEqual(4);
		});
	});

	describe('searching for images', () => {
		it('chooses correct subset of images for given search term', async () => {
			const httpMock = {
				get: jest.fn(
					() =>
						new Promise((res) =>
							res({
								data: mockImageData,
							})
						)
				),
			};

			await act(async () => {
				renderComponentWithMockFetch(httpMock);
			});

			const searchInput = screen.getByRole('textbox');

			userEvent.type(searchInput, 'bear{enter}');

			const activeImages = screen.getAllByRole('img');

			expect(activeImages.length).toBe(1);
		});

		it('displays a "not found" message if there are no search results', async () => {
			const httpMock = {
				get: jest.fn(
					() =>
						new Promise((res) =>
							res({
								data: mockImageData,
							})
						)
				),
			};

			await act(async () => {
				renderComponentWithMockFetch(httpMock);
			});

			const searchInput = screen.getByRole('textbox');

			userEvent.type(searchInput, "doesn't match anything{enter}");

			// verify that no images are displayed
			const activeImages = expect(() =>
				screen.getAllByRole('img')
			).toThrow();

			// verify the no results message is onscreen.  If 'getByText'
			// doesn't find anything, test will fail.
			const notFoundMessage = screen.getByText('No results found!');
		});

		it('can be reset to displaying all images', async () => {
			const httpMock = {
				get: jest.fn(
					() =>
						new Promise((res) =>
							res({
								data: mockImageData,
							})
						)
				),
			};

			await act(async () => {
				renderComponentWithMockFetch(httpMock);
			});

			const searchInput = screen.getByRole('textbox');
			const resetButton = screen.getByTestId('reset-search-icon');

			userEvent.type(searchInput, 'bear{enter}');

			let displayedImages;

			// verify that number of images has been narrowed
			displayedImages = screen.getAllByRole('img');
			expect(displayedImages.length).toEqual(1);

			userEvent.click(resetButton);

			// verify all images are now displayed
			displayedImages = screen.getAllByRole('img');
			expect(displayedImages.length).toEqual(4);
		});
	});
});
