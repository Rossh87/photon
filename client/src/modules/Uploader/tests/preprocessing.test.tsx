import React from 'react';
import Uploader from '../index';
import { AuthStateContext } from '../../Auth/state/useAppState';
import { TAuthState } from '../../Auth/state/appStateTypes';
import { render, screen, act, waitFor, logRoles } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { mockUser } from './mockData';
import { getOversizeImageFile } from '../../../testUtils/imageUtils';
import DependencyContext, {
	createDependenciesObject,
	TImageResizer,
	IHTTPLib,
} from '../../../core/dependencyContext';
import {
	TDedupeNamesPayload,
	TDedupeNamesResponse,
} from 'server/modules/Upload/sharedUploadTypes';
import {
	simulateTwoFilesInput,
	simulateInvalidFileInput,
	simulateSingleFileInput,
} from '../../../testUtils';
import { resetInternals } from 'react-use-fp';
import { TAuthorizedUserResponse } from 'sharedTypes/User';
import { MAX_DEMO_UPLOAD_COUNT } from 'sharedTypes/CONSTANTS';
import AppMessage from '../../appMeta';

const mockAuthState: TAuthState = {
	user: mockUser,
	errors: [],
	appMessage: null,
	demoMessageViewed: false,
};

let appState: TAuthState;

beforeEach(() => {
	appState = Object.assign({}, mockAuthState);
	resetInternals();
});

describe('Uploader component', () => {
	it('displays 1 child for each input file', async () => {
		const mockAxios = {
			post: jest.fn(() => Promise.resolve({ data: [] })),
		} as unknown as IHTTPLib;

		const mockResizer = jest.fn() as TImageResizer;

		const mockDeps = createDependenciesObject(mockAxios)(mockResizer);

		render(
			<DependencyContext.Provider value={mockDeps}>
				<AuthStateContext.Provider value={appState}>
					<Uploader />
				</AuthStateContext.Provider>
			</DependencyContext.Provider>
		);

		const input = screen.getByLabelText(/select files/i);

		await act(async () => simulateTwoFilesInput(input));

		const selectedFilesUI = screen.getAllByText('testImage', {
			exact: false,
		});

		expect(selectedFilesUI.length).toBe(2);
	});

	it('uses "error" text color for invalid inputs', async () => {
		const mockAxios = {
			post: jest.fn(() => Promise.resolve({ data: [] })),
		} as unknown as IHTTPLib;

		const mockResizer = jest.fn() as TImageResizer;

		const mockDeps = createDependenciesObject(mockAxios)(mockResizer);

		render(
			<DependencyContext.Provider value={mockDeps}>
				<AuthStateContext.Provider value={appState}>
					<Uploader />
				</AuthStateContext.Provider>
			</DependencyContext.Provider>
		);

		const input = screen.getByLabelText(/select files/i);

		await act(async () =>
			simulateInvalidFileInput(getOversizeImageFile)('invalidSelection')(
				input
			)
		);

		const UIForValid = screen.getByText('testImage', { exact: false });

		const UIForInvalid = screen.getByText('invalidSelection');

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

		const mockResizer = jest.fn() as TImageResizer;

		const mockDeps = createDependenciesObject(mockAxios)(mockResizer);

		render(
			<DependencyContext.Provider value={mockDeps}>
				<AuthStateContext.Provider value={appState}>
					<Uploader />
				</AuthStateContext.Provider>
			</DependencyContext.Provider>
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

			const mockResizer = jest.fn() as TImageResizer;

			const mockDeps = createDependenciesObject(mockAxios)(mockResizer);

			render(
				<DependencyContext.Provider value={mockDeps}>
					<AuthStateContext.Provider value={appState}>
						<Uploader />
					</AuthStateContext.Provider>
				</DependencyContext.Provider>
			);

			const fileInput = screen.getByLabelText(/select files/i);

			await act(async () => simulateTwoFilesInput(fileInput));

			const selectedFileUI = screen.getByText('testImage1');

			userEvent.click(selectedFileUI);

			const newDisplayNameInput =
				screen.getAllByLabelText('Update name')[0];

			userEvent.type(newDisplayNameInput, 'newDisplayName');

			// cast return type of userEvent.keyboard to void to soothe type defs
			// for 'act'
			await act(
				async () => userEvent.keyboard('{Enter}') as unknown as void
			);

			const updated = screen.getAllByText('newDisplayName');

			expect(updated.length).toEqual(1);
		});

		it('does not update if newly-submitted name is empty', async () => {
			const mockAxios = {
				post: jest.fn(() => Promise.resolve({ data: [] })),
			} as unknown as IHTTPLib;

			const mockResizer = jest.fn() as TImageResizer;

			const mockDeps = createDependenciesObject(mockAxios)(mockResizer);

			render(
				<DependencyContext.Provider value={mockDeps}>
					<AuthStateContext.Provider value={appState}>
						<Uploader />
					</AuthStateContext.Provider>
				</DependencyContext.Provider>
			);

			const fileInput = screen.getByLabelText(/select files/i);

			await act(async () => simulateTwoFilesInput(fileInput));

			const selectedFileUI = screen.getByText('testImage1');

			userEvent.click(selectedFileUI);

			const newDisplayNameInput =
				screen.getAllByLabelText('Update name')[0];

			// select text input that updates file displayName...
			userEvent.click(newDisplayNameInput);

			// ...but type nothing--just hit enter to submit
			userEvent.keyboard('{Enter}');

			const result = screen.getAllByText('testImage1');

			expect(result.length).toEqual(1);
		});
	});

	describe('removing a selected file from the list', () => {
		it('removes the deselected file from the UI', async () => {
			const mockAxios = {
				post: jest.fn(() => Promise.resolve({ data: [] })),
			} as unknown as IHTTPLib;

			const mockResizer = jest.fn() as TImageResizer;

			const mockDeps = createDependenciesObject(mockAxios)(mockResizer);

			render(
				<DependencyContext.Provider value={mockDeps}>
					<AuthStateContext.Provider value={appState}>
						<Uploader />
					</AuthStateContext.Provider>
				</DependencyContext.Provider>
			);

			const fileInput = screen.getByLabelText(/select files/i);

			await act(async () => simulateTwoFilesInput(fileInput));

			const deleteButton = screen.getAllByLabelText('remove file')[0];

			userEvent.click(deleteButton);

			expect(() => screen.getByText('testImage1')).toThrow();
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

			const mockResizer = jest.fn() as TImageResizer;

			const mockDeps = createDependenciesObject(mockAxios)(mockResizer);

			render(
				<DependencyContext.Provider value={mockDeps}>
					<AuthStateContext.Provider value={appState}>
						<Uploader />
					</AuthStateContext.Provider>
				</DependencyContext.Provider>
			);

			const fileInput = screen.getByLabelText(/select files/i);

			await act(async () => simulateTwoFilesInput(fileInput));

			const duplicateNameErrs = screen.getAllByText('already in use', {
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

			const mockResizer = jest.fn() as TImageResizer;

			const mockDeps = createDependenciesObject(mockAxios)(mockResizer);

			render(
				<DependencyContext.Provider value={mockDeps}>
					<AuthStateContext.Provider value={appState}>
						<Uploader />
					</AuthStateContext.Provider>
				</DependencyContext.Provider>
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

			const mockResizer = jest.fn() as TImageResizer;

			const mockDeps = createDependenciesObject(mockAxios)(mockResizer);

			render(
				<DependencyContext.Provider value={mockDeps}>
					<AuthStateContext.Provider value={appState}>
						<Uploader />
					</AuthStateContext.Provider>
				</DependencyContext.Provider>
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

			const updated = screen.getAllByText('newDisplayName');

			expect(updated.length).toEqual(1);
			expect(() =>
				screen.getByText('already in use', { exact: false })
			).toThrow();
		});
	});

	describe('when number of submitted files is too large for demo mode', () => {
		it('displays a flash error message', async () => {
			// these mocks should never be called
			const mockAxios = jest.fn() as unknown as IHTTPLib;

			const mockResizer = jest.fn() as TImageResizer;

			const mockDeps = createDependenciesObject(mockAxios)(mockResizer);

			// simulate user with all their demo-mode uploads used up
			(appState.user as TAuthorizedUserResponse).imageCount =
				MAX_DEMO_UPLOAD_COUNT - 1;

			const { container } = render(
				<DependencyContext.Provider value={mockDeps}>
					<AuthStateContext.Provider value={appState}>
						<AppMessage />
						<Uploader />
					</AuthStateContext.Provider>
				</DependencyContext.Provider>
			);

			const fileInput = screen.getByLabelText(/select files/i);

			simulateTwoFilesInput(fileInput);

			const msg = await screen.findByRole('alert');

			expect(msg).toHaveTextContent('upload');

			const closeErrButton = screen.getByRole('button', {
				name: 'close-upload-component-err',
			});

			userEvent.click(closeErrButton);

			expect(screen.queryByRole('alert')).not.toBeInTheDocument();
		});
	});
});
