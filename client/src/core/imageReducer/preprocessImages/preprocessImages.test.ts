import {
	preprocessFiles,
	generateFileSizeErr,
	generateEmptyFileListErr,
	bytesToHumanReadableSize,
} from '.';
import {
	TPreprocessedFiles,
	TPreprocessErrors,
	IPreprocessDependencies,
	IPreprocessedFile,
} from './imagePreprocessingTypes';
import { createMockFileList } from '../../utils/testUtils';
import { map as Emap, mapLeft as EmapLeft } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { fold as Tfold } from 'fp-ts/lib/These';
import { BASE_IMAGE_UPLOAD_PATH } from '../../../CONSTANTS';
import { getOversizeImage } from '../../../testImages/imageUtils';
import { ImagePreprocessError } from './ImagePreprocessError';

describe('file preprocessing processing fn', () => {
	it('generates an error if file exceeds max file size', () => {
		// grab a local image that exceeds max file size
		const buff = getOversizeImage();

		const mockFile1 = {
			name: 'someFile.jpg',
			body: buff,
			mimeType: 'image/jpeg',
		};

		const mockFile2 = {
			name: 'secondFile.jpg',
			body: 'datadatadatadata',
			mimeType: 'image/jpeg',
		};

		const fileList = createMockFileList(mockFile1, mockFile2);

		const deps = { ownerID: '1234' } as IPreprocessDependencies;

		const result = preprocessFiles(deps)(fileList);

		const neverCalled = jest.fn();

		const assertOnSuccesses = (processedFiles: TPreprocessedFiles) =>
			expect(processedFiles.length).toBe(1);

		const assertOnErrs = (errs: TPreprocessErrors) => {
			expect(errs[0]).toEqual(
				generateFileSizeErr((mockFile1 as unknown) as File)
			);
		};

		const assertOnBoth = (e: TPreprocessErrors, a: TPreprocessedFiles) => {
			assertOnErrs(e);
			assertOnSuccesses(a);
		};

		Tfold<TPreprocessErrors, TPreprocessedFiles, void>(
			neverCalled,
			neverCalled,
			assertOnBoth
		)(result);

		expect(neverCalled).not.toHaveBeenCalled();
	});

	it('produces correct err if filelist is empty', () => {
		const fileList = createMockFileList();

		const deps = { ownerID: '1234' } as IPreprocessDependencies;

		const result = preprocessFiles(deps)(fileList);

		const neverCalled = jest.fn();

		const assertOnErrs = (errs: TPreprocessErrors) => {
			expect(errs[0]).toEqual(
				ImagePreprocessError.create(
					'at least one file must be selected'
				)
			);
		};

		Tfold<TPreprocessErrors, TPreprocessedFiles, void>(
			assertOnErrs,
			neverCalled,
			neverCalled
		)(result);

		expect(neverCalled).not.toHaveBeenCalled();
	});
});
