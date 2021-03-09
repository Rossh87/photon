import {
	requestResumableUpload,
	ResumableUploadCreationErr,
} from './requestResumableUpload';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { makeReadEnv } from '../../../core/readEnv';
import { mockUploadRequestObject } from './mockData';
import { map, mapLeft } from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

describe('function to get resumable upload URI from GCS', () => {
	it('throws if needed env var is missing', () => {
		// GOOGLE_BUCKET_NAME will be undefined
		const deps = {
			readEnv: makeReadEnv({}),
		} as Required<IAsyncDeps>;

		const underTest = requestResumableUpload(mockUploadRequestObject);
		const expectedErr = new Error(
			'missing variable GOOGLE_STORAGE_BUCKET_NAME from environment'
		);

		expect(() => underTest(deps)).toThrowError(expectedErr);
	});

	it('returns correct error if upload request to GCS fails', async () => {
		const expectedErrMsg = 'unable to comply';
		const expectedErr = ResumableUploadCreationErr.create(
			mockUploadRequestObject,
			expectedErrMsg
		);

		const createResumableUpload = jest.fn(() =>
			Promise.reject(expectedErrMsg)
		);

		const file = jest.fn(() => ({
			createResumableUpload,
		}));

		const bucket = jest.fn(() => ({
			file,
		}));

		const deps = ({
			readEnv: makeReadEnv({
				GOOGLE_STORAGE_BUCKET_NAME: 'my-bucket',
			}),
			gcs: {
				bucket,
			},
		} as unknown) as Required<IAsyncDeps>;

		const assertions = (e: unknown) => expect(e).toEqual(expectedErr);
		const neverCalled = jest.fn();

		await pipe(
			requestResumableUpload(mockUploadRequestObject)(deps),
			map(neverCalled),
			mapLeft(assertions)
		)();

		expect(neverCalled).not.toHaveBeenCalled();
		expect(bucket).toHaveBeenCalledWith('my-bucket');
		expect(file).toHaveBeenCalledWith(mockUploadRequestObject.displayName);
	});

	it('returns correct data when successful', async () => {
		const mockSessionURI = 'testURI';

		const createResumableUpload = jest.fn(() =>
			Promise.resolve([mockSessionURI])
		);

		const file = jest.fn(() => ({
			createResumableUpload,
		}));

		const bucket = jest.fn(() => ({
			file,
		}));

		const deps = ({
			readEnv: makeReadEnv({
				GOOGLE_STORAGE_BUCKET_NAME: 'my-bucket',
			}),
			gcs: {
				bucket,
			},
		} as unknown) as Required<IAsyncDeps>;

		const assertions = (data: any) =>
			expect(data[0]).toEqual(mockSessionURI);

		const neverCalled = jest.fn();

		await pipe(
			requestResumableUpload(mockUploadRequestObject)(deps),
			map(assertions),
			mapLeft(neverCalled)
		)();

		expect(neverCalled).not.toHaveBeenCalled();
	});
});