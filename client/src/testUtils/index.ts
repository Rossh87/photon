import { getTestJPEGFile } from './imageUtils';
import { createMockFileList } from './fileMocks';
import { fireEvent } from '@testing-library/dom';

export const simulateTwoFilesInput = (targetElement: HTMLElement) => {
	const files = [
		getTestJPEGFile('testImage1', 'small'),
		getTestJPEGFile('testImage2', 'med'),
	];
	const mockFileList = createMockFileList(...files);
	fireEvent.change(targetElement, { target: { files: mockFileList } });
};

export const simulateSingleFileInput = (targetElement: HTMLElement) => {
	const files = [getTestJPEGFile('testImage1', 'small')];
	const mockFileList = createMockFileList(...files);

	fireEvent.change(targetElement, { target: { files: mockFileList } });
};

export const simulateInvalidFileInput =
	(getInvalidFile: (...args: any[]) => File) =>
	(...extraArgs: any[]) =>
	(targetElement: HTMLElement) => {
		const files = [
			getInvalidFile(...extraArgs),
			getTestJPEGFile('testImage1', 'small'),
		];
		const mockFileList = createMockFileList(...files);

		fireEvent.change(targetElement, {
			target: { files: mockFileList },
		});
	};
