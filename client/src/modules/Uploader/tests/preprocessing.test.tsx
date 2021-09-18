import React from 'react';
import Uploader from '../index';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { getOversizeImageFile } from '../../../testUtils/imageUtils';
import { IHTTPLib } from '../../../core/dependencyContext';
import {
	TDedupeNamesPayload,
	TDedupeNamesResponse,
} from 'server/modules/Upload/sharedUploadTypes';
import {
	simulateTwoFilesInput,
	simulateInvalidFileInput,
} from '../../../testUtils';
import { resetInternals } from 'react-use-fp';
import { TAuthorizedUserResponse } from 'sharedTypes/User';
import { MAX_DEMO_UPLOAD_COUNT } from 'sharedTypes/CONSTANTS';
import AppMessage from '../../AppMessage';
import { WithMockAppState } from '../../../testUtils/renderWithMockAppState';
import mockAppState from '../../../testUtils/mockState';
import { IAppState } from '../../appState/appStateTypes';

beforeEach(() => resetInternals());

describe('Uploader component', () => {
	it('displays 1 child for each input file', async () => {
		const mockAxios = {
			post: jest.fn(() => Promise.resolve({ data: [] })),
		} as unknown as IHTTPLib;

		render(
			<WithMockAppState mockFetcher={mockAxios}>
				<Uploader />
			</WithMockAppState>
		);

		const input = screen.getByLabelText(/select files/i);

		await act(async () => simulateTwoFilesInput(input));

		const selectedFilesUI = screen.getAllByText(/testimage/i, {
			exact: false,
		});

		expect(selectedFilesUI.length).toBe(2);
	});

	it('uses "error" text color for invalid inputs', async () => {
		const mockAxios = {
			post: jest.fn(() => Promise.resolve({ data: [] })),
		} as unknown as IHTTPLib;

		render(
			<WithMockAppState mockFetcher={mockAxios}>
				<Uploader />
			</WithMockAppState>
		);

		const input = screen.getByLabelText(/select files/i);

		await act(async () =>
			simulateInvalidFileInput(getOversizeImageFile)('invalidSelection')(
				input
			)
		);

		const UIForValid = screen.getByText(/testimage/i);

		// NB we don't use regex to search for this--too many hits.  Instead we want this *exact*
		// element.
		const UIForInvalid = screen.getByText('invalidSelection.jpg');

		const validColor = window
			.getComputedStyle(UIForValid)
			.getPropertyValue('color');
		const invalidColor = window
			.getComputedStyle(UIForInvalid)
			.getPropertyValue('color');

		expect(validColor).not.toEqual(invalidColor);
	});

	it('displays error message for files with local validation errors', async () => {
		const mockAxios = {
			post: jest.fn(() => Promise.resolve({ data: [] })),
		} as unknown as IHTTPLib;

		render(
			<WithMockAppState mockFetcher={mockAxios}>
				<Uploader />
			</WithMockAppState>
		);

		const input = screen.getByLabelText(/select files/i);

		await act(async () =>
			simulateInvalidFileInput(getOversizeImageFile)('invalidSelection')(
				input
			)
		);

		const received = screen.getByText(
			'exceeds maximum initial image size',
			{ exact: false }
		);

		expect(received).not.toBeNull();
	});

	describe('updating the display name of a selected file', () => {
		it('updates file display name with user input', async () => {
			const mockAxios = {
				post: jest.fn(() => Promise.resolve({ data: [] })),
			} as unknown as IHTTPLib;

			render(
				<WithMockAppState mockFetcher={mockAxios}>
					<Uploader />
				</WithMockAppState>
			);

			const fileInput = screen.getByLabelText(/select files/i);

			await act(async () => simulateTwoFilesInput(fileInput));

			const selectedFileUI = screen.getByText(/testimage1/i);

			userEvent.click(selectedFileUI);

			const newDisplayNameInput =
				screen.getAllByLabelText('Update name')[0];

			userEvent.type(newDisplayNameInput, 'newDisplayName');

			// cast return type of userEvent.keyboard to void to soothe type defs
			// for 'act'
			await act(
				async () => userEvent.keyboard('{Enter}') as unknown as void
			);

			const updated = screen.getAllByText(/newdisplayname/i);

			expect(updated.length).toEqual(1);
		});

		it('does not update if newly-submitted name is empty', async () => {
			const mockAxios = {
				post: jest.fn(() => Promise.resolve({ data: [] })),
			} as unknown as IHTTPLib;

			render(
				<WithMockAppState mockFetcher={mockAxios}>
					<Uploader />
				</WithMockAppState>
			);
			const fileInput = screen.getByLabelText(/select files/i);

			await act(async () => simulateTwoFilesInput(fileInput));

			const selectedFileUI = screen.getByText(/testImage1/i);

			userEvent.click(selectedFileUI);

			const newDisplayNameInput =
				screen.getAllByLabelText('Update name')[0];

			// select text input that updates file displayName...
			userEvent.click(newDisplayNameInput);

			// ...but type nothing--just hit enter to submit
			userEvent.keyboard('{Enter}');

			const result = screen.getAllByText(/testimage1/i);

			expect(result.length).toEqual(1);
		});
	});

	describe('removing a selected file from the list', () => {
		it('removes the deselected file from the UI', async () => {
			const mockAxios = {
				post: jest.fn(() => Promise.resolve({ data: [] })),
			} as unknown as IHTTPLib;

			render(
				<WithMockAppState mockFetcher={mockAxios}>
					<Uploader />
				</WithMockAppState>
			);

			const fileInput = screen.getByLabelText(/select files/i);

			await act(async () => simulateTwoFilesInput(fileInput));

			const deleteButton = screen.getAllByLabelText('remove file')[0];

			userEvent.click(deleteButton);

			expect(screen.queryByText(/testimage1/i)).not.toBeInTheDocument();
		});
	});

	describe('displayName deduplication', () => {
		it('displays a "file name in use error" if submitted file displayName already exists on CDN', async () => {
			const responseWithDupes: TDedupeNamesResponse = [
				{ _id: 'abc123', ownerID: '1234', displayName: 'testImage1' },
			];

			const mockAxios = {
				post: jest.fn(() =>
					Promise.resolve({ data: responseWithDupes })
				),
			} as unknown as IHTTPLib;

			render(
				<WithMockAppState mockFetcher={mockAxios}>
					<Uploader />
				</WithMockAppState>
			);

			const fileInput = screen.getByLabelText(/select files/i);

			await act(async () => simulateTwoFilesInput(fileInput));

			const duplicateNameErrs = screen.getAllByText(/already in use/i, {
				exact: false,
			});

			expect(duplicateNameErrs.length).toEqual(1);
		});

		it('preferentially displays validation errors over duplicate displayName message', async () => {
			// selected file will have a duplicate name message, but it won't be displayed, since other
			// validation errors are more serious and will likely lead to removing the file from the list anyway
			const responseWithDupes: TDedupeNamesResponse = [
				{
					_id: 'abc123',
					ownerID: '1234',
					displayName: 'invalidSelection',
				},
			];

			const mockAxios = {
				post: jest.fn(() =>
					Promise.resolve({ data: responseWithDupes })
				),
			} as unknown as IHTTPLib;

			render(
				<WithMockAppState mockFetcher={mockAxios}>
					<Uploader />
				</WithMockAppState>
			);

			const fileInput = screen.getByLabelText(/select files/i);

			await act(async () =>
				simulateInvalidFileInput(getOversizeImageFile)(
					'invalidSelection'
				)(fileInput)
			);

			const validationErrs = screen.getAllByText(
				'exceeds maximum initial image size',
				{ exact: false }
			);

			expect(validationErrs.length).toEqual(1);

			// ensure there's no duplicate name message on screen
			expect(() =>
				screen.getAllByText('already in use', { exact: false })
			).toThrow();
		});

		it('re-checks for duplicates whenever a displayname is updated', async () => {
			const responseWithDupes = Promise.resolve({
				data: [
					{
						_id: 'abc123',
						ownerID: '1234',
						displayName: 'testImage1',
					},
				],
			});
			const responseWithoutDupes = Promise.resolve({ data: [] });

			// flag a duplicate if file name is 'testImage1'.  Otherwise, indicate
			// no dupes
			const mockAxios = {
				post: jest.fn((_, payload: TDedupeNamesPayload) =>
					payload.displayNames.some((name) => name === 'testImage1')
						? responseWithDupes
						: responseWithoutDupes
				),
			} as unknown as IHTTPLib;

			render(
				<WithMockAppState mockFetcher={mockAxios}>
					<Uploader />
				</WithMockAppState>
			);

			const fileInput = screen.getByLabelText(/select files/i);

			await act(async () => simulateTwoFilesInput(fileInput));

			// ensure presence of a duplicate displayName message
			const duplicate = screen.getByText('already in use', {
				exact: false,
			});

			expect(duplicate).not.toBeNull();

			// now, update the displayName to something else
			userEvent.click(duplicate);

			const newDisplayNameInput =
				screen.getAllByLabelText('Update name')[0];

			userEvent.type(newDisplayNameInput, 'newDisplayName');

			// cast return type of userEvent.keyboard to void to soothe type defs
			// for 'act'
			await act(
				async () => userEvent.keyboard('{Enter}') as unknown as void
			);

			const updated = screen.getAllByText(/newdisplayname/i);

			expect(updated.length).toEqual(1);
			expect(() =>
				screen.getByText('already in use', { exact: false })
			).toThrow();
		});
	});

	describe('when number of submitted files is too large for demo mode', () => {
		it('displays a flash error message', async () => {
			// simulate user with all their demo-mode uploads used up
			const usedUpAppState: IAppState = {
				...mockAppState,
				user: {
					...(mockAppState.user as TAuthorizedUserResponse),
					imageCount: MAX_DEMO_UPLOAD_COUNT - 1,
					accessLevel: 'demo',
				},
			};

			render(
				<WithMockAppState mockState={usedUpAppState}>
					<AppMessage />
					<Uploader />
				</WithMockAppState>
			);

			const fileInput = screen.getByLabelText(/select files/i);

			simulateTwoFilesInput(fileInput);

			const msg = await screen.findByRole('alert');

			expect(msg).toHaveTextContent('uploads');

			const closeErrButton = screen.getByLabelText('close-message');

			userEvent.click(closeErrButton);

			expect(screen.queryByRole('alert')).not.toBeInTheDocument();
		});
	});
});
