import { processUploadInitSuccess } from './processUploadInitSuccess';
import { mockUploadRequestResponse, mockUploadRequestObject } from './mockData';

describe('function to process resumable URI response', () => {
	it('adds URI to the upload request metadata object', () => {
		const result = processUploadInitSuccess(mockUploadRequestResponse)(
			mockUploadRequestObject
		);

		expect(result.resumableURI).toEqual('https://google.uploads.mock');
	});
});
