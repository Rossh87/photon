import React from 'react';
import UploadManager from '../index';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {mockUser} from './mockData'
import { IUser } from '../../../auth/AuthManager/authTypes';
import {getTestJPEGFile, getOversizeImageFile} from '../../../../testUtils/imageUtils'
import {createMockFileList} from '../../../../testUtils/fileMocks'

let user: IUser;

beforeEach(() => user = Object.assign({}, mockUser));

const simulateFileInput = (targetElement: HTMLElement) => {
	const files = [getTestJPEGFile('testImage1', 'small'), getTestJPEGFile('testImage2', 'med')]
	const mockFileList = createMockFileList(...files);

	return fireEvent.change(targetElement, {target: {files: mockFileList}});
}

const simulateInvalidFileInput = (getInvalidFile: (...args: any[]) => File) => (...extraArgs: any[])=> (targetElement: HTMLElement) => {
	const files = [getInvalidFile(...extraArgs), getTestJPEGFile('testImage1', 'small')];
	const mockFileList = createMockFileList(...files);

	return fireEvent.change(targetElement, {target: {files: mockFileList}});
}

describe('UploadManager component', () => {
	it('displays 1 child for each input file', () => {
		render(<UploadManager user={mockUser}/>);

		const input = screen.getByLabelText('Choose Files');
		
		simulateFileInput(input);

		const selectedFilesUI = screen.getAllByText('testImage', {exact: false});

		expect(selectedFilesUI.length).toBe(2)
	});

	it('uses "error" text color for invalid inputs', () => {
		render(<UploadManager user={mockUser}/>);

		const input = screen.getByLabelText('Choose Files');
		
		simulateInvalidFileInput(getOversizeImageFile)('invalidSelection')(input);

		const UIForValid = screen.getByText('testImage', {exact: false});

		const UIForInvalid =  screen.getByText('invalidSelection', {exact: false});

		const validColor = window.getComputedStyle(UIForValid).getPropertyValue('color')
		const invalidColor = window.getComputedStyle(UIForInvalid).getPropertyValue('color')

		expect(validColor).not.toEqual(invalidColor)
	});

	describe('updating the display name of a selected file', () => {
		it('updates file display name with user input', () => {
			render(<UploadManager user={mockUser}/>);
	
			const fileInput = screen.getByLabelText('Choose Files');
			
			simulateFileInput(fileInput);
	
			const selectedFileUI = screen.getByText('testImage1');
	
			userEvent.click(selectedFileUI);
	
			const newDisplayNameInput = screen.getAllByLabelText('Update name')[0];
	
			userEvent.type(newDisplayNameInput, 'newDisplayName')
	
			userEvent.keyboard('{Enter}');
	
			const updated = screen.getAllByText('newDisplayName');
	
			expect(updated.length).toEqual(1);
		});
	
		it('does not update if newly-submitted name is empty', () => {
			render(<UploadManager user={mockUser}/>);
	
			const fileInput = screen.getByLabelText('Choose Files');
			
			simulateFileInput(fileInput);
	
			const selectedFileUI = screen.getByText('testImage1');
	
			userEvent.click(selectedFileUI);
	
			const newDisplayNameInput = screen.getAllByLabelText('Update name')[0];
			
			// select text input that updates file displayName...
			userEvent.click(newDisplayNameInput)

			// ...but type nothing--just hit enter to submit
			userEvent.keyboard('{Enter}');
	
			const result = screen.getAllByText('testImage1');
	
			expect(result.length).toEqual(1);
		})

	});

	describe('removing a selected file from the list', () => {
		it('removes the deselected file from the UI', () => {

			render(<UploadManager user={mockUser}/>);
		
			const fileInput = screen.getByLabelText('Choose Files');
			
			simulateFileInput(fileInput);
	
			const deleteButton = screen.getAllByLabelText('remove file')[0];
	
			userEvent.click(deleteButton);
	
			expect(() => screen.getByText('testImage1')).toThrow();
		})
	})
});
