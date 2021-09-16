import Uploader from '../index';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockResizingData } from './mockData';
import { getOversizeImageFile } from '../../../testUtils/imageUtils';
import {
	TImageResizer,
} from '../../../core/dependencyContext';
import {
	REQUEST_UPLOAD_URI_ENDPOINT,
	DEDUPLICATION_ENDPOINT,
} from '../http/endpoints';
import { IHTTPLib } from '../../../core/sharedClientTypes';
import { IDedupeMetadata } from '../../../../../server/modules/Upload/sharedUploadTypes';
import {
	simulateTwoFilesInput,
	simulateInvalidFileInput,
} from '../../../testUtils';
import { resetInternals } from 'react-use-fp';
import { WithMockAppState } from '../../../testUtils/renderWithMockAppState';

beforeEach(() => {
	resetInternals();
});

describe('Uploader component when files are submitted', () => {
	it('does nothing if selected files have errors', async () => {
		const mockAxios = {
			post: jest.fn(() => Promise.resolve({ data: [] })),
		} as unknown as IHTTPLib;

		render(
			<WithMockAppState mockFetcher={mockAxios}>
				<Uploader />
			</WithMockAppState>
		);

		const input = screen.getByLabelText(/select files/i);
		const submitButton = screen.getByRole('button', { name: /submit/i });

		await act(async () =>
			simulateInvalidFileInput(getOversizeImageFile)('invalidSelection')(
				input
			)
		);

		// ensure a file is actually in the UI to make sure test is valid
		const invalidFile = screen.getByText('invalidSelection');

		expect(invalidFile).not.toBeNull();

		/**This will throw if component is working correctly because MUI submit button
		 * will have pointer events set to 'none'.  The user-event library will not
		 * allow a simulated click on a element configured this way.
		 */
		expect(() => userEvent.click(submitButton)).toThrow();
	});

	it('does nothing if any selected files have duplicate displayName', async () => {
		const mockDupeResponse: IDedupeMetadata = {
			ownerID: '1234',
			_id: 'abc123',
			displayName: 'testImage1',
		};

		const mockAxios = {
			post: jest.fn(() => Promise.resolve({ data: [mockDupeResponse] })),
		} as unknown as IHTTPLib;

		render(
			<WithMockAppState mockFetcher={mockAxios}>
				<Uploader />
			</WithMockAppState>
		);

		const input = screen.getByLabelText(/select files/i);
		const submitButton = screen.getByRole('button', { name: /submit/i });

		await act(async () => simulateTwoFilesInput(input));

		// ensure a file is actually in the UI and flagged as a duplicate displayName
		// to make sure test is valid
		const dupeFile = screen.getByText('already in use', { exact: false });

		expect(dupeFile).not.toBeNull();

		/**This will throw if component is working correctly because MUI submit button
		 * will have pointer events set to 'none'.  The user-event library will not
		 * allow a simulated click on a element configured this way.
		 */
		expect(() => userEvent.click(submitButton)).toThrow();
	});

	it('displays correct error message on files that fail to upload', async () => {
		const mockAxios = {
			post: jest.fn(function (url: string) {
				switch (url) {
					case DEDUPLICATION_ENDPOINT:
						return Promise.resolve({ data: [] });
					case REQUEST_UPLOAD_URI_ENDPOINT:
						return Promise.reject('failure');
					default:
						throw new Error('missed case in mock HTTP lib!!');
				}
			}),
		} as unknown as IHTTPLib;

		const mockResizer = jest.fn(
			() => mockResizingData
		) as unknown as TImageResizer;

		render(
			<WithMockAppState mockFetcher={mockAxios} mockImgLib={mockResizer}>
				<Uploader />
			</WithMockAppState>
		);

		const input = screen.getByLabelText(/select files/i);

		const submitButton = screen.getByRole('button', { name: /submit/i });

		await act(async () => simulateTwoFilesInput(input));

		await act(async () => userEvent.click(submitButton));

		const result = screen.getAllByText(
			'Attempt to get upload URIs from server failed.'
		);

		expect(result.length).toEqual(2);
	});
});
