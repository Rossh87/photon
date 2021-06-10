import React from 'react';
import { simulateInvalidFileInput } from './preprocessing.test';
import Uploader from '../index';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockUser, mockImageData, mockResizingData } from './mockData';
import { getOversizeImageFile } from '../../../testUtils/imageUtils';
import { createMockFileList } from '../../../testUtils/fileMocks';
import DependencyContext, {
	IDependencies,
	createDependenciesObject,
	TImageResizer,
} from '../../../core/dependencyContext';
import { AxiosInstance } from 'axios';

export const simulateFileInput = (targetElement: HTMLElement) => {
	const files = [mockImageData];
	const mockFileList = createMockFileList(...files);
	return fireEvent.change(targetElement, { target: { files: mockFileList } });
};

describe('Uploader component when files are submitted', () => {
	it('does nothing if selected files have errors', () => {
		const mockDeps = {
			http: jest.fn(),
			imageReducer: jest.fn(),
			dispatch: jest.fn(),
		} as IDependencies<any>;
		render(
			<DependencyContext.Provider value={() => mockDeps}>
				<Uploader user={mockUser} />
			</DependencyContext.Provider>
		);

		const input = screen.getByLabelText('Choose Files');
		const submitButton = screen.getByText('Submit!');

		simulateInvalidFileInput(getOversizeImageFile)('invalidSelection')(
			input
		);

		/**This will throw if component is working correctly because MUI submit button
		 * will have pointer events set to 'none'.  The user-event library will not
		 * allow a simulated click on a element configured this way.
		 */
		expect(() => userEvent.click(submitButton)).toThrow();
	}),
		it('displays correct error message on files that fail to upload', async () => {
			const mockAxios = {
				post: jest.fn(() => Promise.reject('failure')),
			} as unknown as AxiosInstance;

			const mockResizer = jest.fn(
				() => mockResizingData
			) as unknown as TImageResizer;

			const mockDeps = createDependenciesObject(mockAxios)(mockResizer);

			render(
				<DependencyContext.Provider value={mockDeps}>
					<Uploader user={mockUser} />
				</DependencyContext.Provider>
			);

			const input = screen.getByLabelText('Choose Files');

			const submitButton = screen.getByText('Submit!');

			simulateFileInput(input);

			userEvent.click(submitButton);

			const result = await screen.findByText(
				'Attempt to get upload URIs from server failed.'
			);

			expect(result).not.toBeNull();
		});
});
