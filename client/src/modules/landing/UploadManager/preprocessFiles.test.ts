import {
    preprocessFiles,
    generateFileSizeErr,
    generateEmptyFileListErr,
    bytesToHumanReadableSize,
} from './preprocessFiles';
import {
    IPreprocessedFiles,
    IUploadReaderDependencies,
    IProcessedFile,
} from './uploadTypes';
import { createMockFileList } from '../../../core/utils/testUtils';
import { map as Emap, mapLeft as EmapLeft } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { BASE_IMAGE_UPLOAD_PATH } from '../../../CONSTANTS';
import { getOversizeImage } from '../../../testImages/imageUtils';

// const bits1 = [new ArrayBuffer(10), new ArrayBuffer(5)];
// const bits2 = [new ArrayBuffer(100), new ArrayBuffer(22)];
// const file1 = new File(bits1, 'testFile');
// const file2 = new File(bits2, 'anotherTestFile');

describe('file preprocessing processing fn', () => {
    it('correctly populates all paths', () => {
        const deps = { ownerID: '1234' } as IUploadReaderDependencies;

        const mockFile1 = {
            name: 'someFile.jpg',
            body: 'datadatadatadata',
            mimeType: 'image/jpeg',
        };

        const fileList = createMockFileList(mockFile1);

        const expectedSize = bytesToHumanReadableSize(fileList[0].size);

        const expectedPaths = [
            `${BASE_IMAGE_UPLOAD_PATH}/1234/someFile.jpg/tiny`,
            `${BASE_IMAGE_UPLOAD_PATH}/1234/someFile.jpg/small`,
            `${BASE_IMAGE_UPLOAD_PATH}/1234/someFile.jpg/medium`,
            `${BASE_IMAGE_UPLOAD_PATH}/1234/someFile.jpg/large`,
        ];

        // we'll only assert on the paths that our function sets
        const expected: Partial<IProcessedFile> = {
            uploadPaths: expectedPaths,
            ownerID: deps.ownerID,
            humanReadableSize: expectedSize,
        };

        const result = preprocessFiles(fileList)(deps);

        const expectation = (res: IPreprocessedFiles) =>
            expect(res[0]).toMatchObject(expected);

        pipe(result, Emap(expectation));
    });

    it('produces correct err if any file exceeds maximum size', () => {
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

        const deps = { ownerID: '1234' } as IUploadReaderDependencies;

        const result = preprocessFiles(fileList)(deps);

        const neverCalled = jest.fn();

        pipe(
            result,
            Emap(neverCalled),
            EmapLeft((res) =>
                expect(res).toEqual(generateFileSizeErr(mockFile1.name))
            )
        );

        expect(neverCalled).not.toHaveBeenCalled();
    });

    it('produces correct err if filelist is empty', () => {
        const fileList = createMockFileList();

        const deps = { ownerID: '1234' } as IUploadReaderDependencies;

        const result = preprocessFiles(fileList)(deps);

        const neverCalled = jest.fn();

        pipe(
            result,
            Emap(neverCalled),
            EmapLeft((res) => expect(res).toEqual(generateEmptyFileListErr()))
        );

        expect(neverCalled).not.toHaveBeenCalled();
    });
});
