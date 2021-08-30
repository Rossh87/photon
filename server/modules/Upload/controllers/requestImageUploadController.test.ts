import { TDBUser } from 'sharedTypes/User';
import {
	ICombinedUploadRequestMetadata,
	IUploadsRequestPayload,
} from 'sharedTypes/Upload';
import { requestImageUploadsController } from './requestImageUploadsController';
import {
	mockUserFromDatabase,
	mockObjectID,
} from '../../auth/helpers/mockData';
import { Request, Response, NextFunction } from 'express';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { DBReadError } from '../../../core/repo';
import { mockUploadsRequestPayload } from '../helpers/mockData';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import { MAX_DEMO_UPLOAD_COUNT } from '../../../../sharedTypes/CONSTANTS';

let mockPayload: IUploadsRequestPayload;
let mockUser: TDBUser;

beforeEach(() => {
	mockPayload = { ...mockUploadsRequestPayload };
	mockUser = { ...mockUserFromDatabase };
});

// Note that most of this controller logic is tested in '../helpers/requestResumableUPload.test.ts',
// so we only test the failure behavior here.
describe('controller to request resumable upload URIs', () => {
	it("passes to err handler if user's max upload count would be exceeded", async () => {
		// set mockUser's imageCount to the max capacity
		mockUser = {
			...mockUser,
			imageCount: MAX_DEMO_UPLOAD_COUNT,
			accessLevel: 'demo',
		};

		const req = {
			session: {
				user: mockUser,
			},

			body: mockPayload,
		} as Request;

		const mockNext = jest.fn();

		const res = {
			status: jest.fn(),
			json: jest.fn(),
		} as unknown as Response;

		const expectedErr = new BaseError(
			'Request exceeds max number of uploads for user running in "demo" mode',
			HTTPErrorTypes.FORBIDDEN
		);

		// don't need any async deps for this request since it fails immediately
		await requestImageUploadsController({} as unknown as IAsyncDeps)(
			req,
			res,
			mockNext
		);

		expect(mockNext).toHaveBeenCalledWith(expectedErr);
	});
});
