import ImageSearch from '../index';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockImageData } from './mockData';
import { REQUEST_USER_IMG_DATA_ENDPOINT } from '../http/endpoints';
import { resetInternals } from 'react-use-fp';
import { WithMockAppState } from '../../../testUtils/renderWithMockAppState';
import { IHTTPLib } from '../../../core/sharedClientTypes';

beforeEach(() => resetInternals());

// const renderComponentWithMockFetch = (http: any) =>
// 	render(
// 		<DependencyContext.Provider
// 			value={(dispatch: Dispatch<any>) => ({
// 				http: (fn: any) => fn(http),
// 				dispatch,
// 				// unused by this component
// 				imageReducer: jest.fn(),
// 			})}
// 		>
// 			<ImageSearch />
// 		</DependencyContext.Provider>
// 	);

describe('The ImageSearch component', () => {
	describe('intial image loading', () => {
		it('requests data from correct URL on mount', async () => {
			const mockAxios = {
				get: jest.fn().mockResolvedValue({
					data: mockImageData,
				}),
			} as unknown as IHTTPLib;

			await act(async () => {
				render(
					<WithMockAppState mockFetcher={mockAxios}>
						<ImageSearch />
					</WithMockAppState>
				);
				return;
			});

			expect(mockAxios.get).toHaveBeenCalledWith(
				REQUEST_USER_IMG_DATA_ENDPOINT,
				{ withCredentials: true }
			);
		});

		it('displays one image card for each image data loaded', async () => {
			const mockAxios = {
				get: jest.fn().mockResolvedValue({
					data: mockImageData,
				}),
			} as unknown as IHTTPLib;

			await act(async () => {
				render(
					<WithMockAppState mockFetcher={mockAxios}>
						<ImageSearch />
					</WithMockAppState>
				);
				return;
			});

			const firstImage = screen.getAllByRole('img');

			// length should be equal to number of elements in mock data array.
			// Test will break if mock data length changes.
			expect(firstImage.length).toEqual(4);
		});
	});

	describe('searching for images', () => {
		it('chooses correct subset of images for given search term', async () => {
			const mockAxios = {
				get: jest.fn().mockResolvedValue({
					data: mockImageData,
				}),
			} as unknown as IHTTPLib;

			await act(async () => {
				render(
					<WithMockAppState mockFetcher={mockAxios}>
						<ImageSearch />
					</WithMockAppState>
				);
				return;
			});

			const searchInput = screen.getByRole('textbox');

			userEvent.type(searchInput, 'bear{enter}');

			const activeImages = screen.getAllByRole('img');

			expect(activeImages.length).toBe(1);
		});

		it('displays a "not found" message if there are no search results', async () => {
			const mockAxios = {
				get: jest.fn().mockResolvedValue({
					data: mockImageData,
				}),
			} as unknown as IHTTPLib;

			await act(async () => {
				render(
					<WithMockAppState mockFetcher={mockAxios}>
						<ImageSearch />
					</WithMockAppState>
				);
				return;
			});

			const searchInput = screen.getByRole('textbox');

			userEvent.type(searchInput, "doesn't match anything{enter}");

			// verify that no images are displayed
			const activeImages = screen.queryAllByRole('img');

			expect(activeImages.length).toBe(0);

			// verify the no results message is onscreen.  If 'getByText'
			// doesn't find anything, test will fail.
			screen.getByText('No results found!');
		});

		it('can be reset to displaying all images', async () => {
			const mockAxios = {
				get: jest.fn().mockResolvedValue({
					data: mockImageData,
				}),
			} as unknown as IHTTPLib;

			await act(async () => {
				render(
					<WithMockAppState mockFetcher={mockAxios}>
						<ImageSearch />
					</WithMockAppState>
				);
				return;
			});

			const searchInput = screen.getByRole('textbox');
			const resetButton = screen.getByLabelText('reset-image-search');

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
