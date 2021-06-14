import { IDBUser } from '../../User/sharedUserTypes';
import { ICombinedUploadRequestMetadata } from '../sharedUploadTypes';
import { getUploadMetadataController } from './getUploadMetadataController';
import {
	mockUserFromDatabase,
	mockObjectID,
} from '../../auth/helpers/mockData';
import { Request, Response, NextFunction } from 'express';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { DBReadError } from '../../../core/repo';

const _mockRequestData1: ICombinedUploadRequestMetadata = {
	ownerID: 'abc123',
	displayName: 'someFile.jpg',
	mediaType: 'image/jpeg',
	sizeInBytes: 1000,
	integrityHash: ['123abc', '456def'],
	availableWidths: [250, 700],
	publicPathPrefix: 'googlestorage/1234/someFile.jpg',
};

const _mockRequestData2: ICombinedUploadRequestMetadata = {
	ownerID: 'abc123',
	displayName: 'someOtherFile.jpg',
	mediaType: 'image/jpeg',
	sizeInBytes: 1000,
	integrityHash: ['456', '789'],
	availableWidths: [250, 700],
	publicPathPrefix: 'googlestorage/1234/someOtherFile.jpg',
};

let mockRequestData1: ICombinedUploadRequestMetadata;
let mockRequestData2: ICombinedUploadRequestMetadata;
let mockUser: IDBUser;

beforeEach(() => {
	mockRequestData1 = Object.assign({}, _mockRequestData1);
	mockRequestData2 = Object.assign({}, _mockRequestData2);
	mockUser = Object.assign({}, mockUserFromDatabase);
});

describe('controller to send saved upload data to client', () => {
	it('invokes db with correct arguments', async () => {
		const req = {
			session: {
				user: mockUser,
			},
		} as Request;

		const res = {
			status: jest.fn(),
			json: jest.fn(),
		} as unknown as Response;

		const responseData = [mockRequestData1, mockRequestData2];

		const mockFind = jest.fn((query, options) => ({
			toArray: () => Promise.resolve(responseData),
		}));

		const deps = {
			repoClient: {
				db: (s: string) => ({
					collection: (t: string) => ({
						find: mockFind,
					}),
				}),
			},
		} as unknown as IAsyncDeps;

		await getUploadMetadataController(deps)(
			req,
			res,
			jest.fn() as NextFunction
		);

		expect(mockFind).toHaveBeenCalledWith(
			{ ownerID: mockObjectID.toHexString() },
			{ sort: { _id: -1 } }
		);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(responseData);
	});

	it('passes errors to error handler', async () => {
		const req = {
			session: {
				user: mockUser,
			},
		} as Request;

		const mockNext = jest.fn() as NextFunction;

		const expectedErr = DBReadError.create(
			'uploads',
			{ ownerID: mockObjectID.toHexString() },
			'some failure reason'
		);

		const failedRead = jest.fn(() => Promise.reject(expectedErr));

		const deps = {
			repoClient: {
				db: (s: string) => ({
					collection: (t: string) => ({
						find: () => ({
							toArray: failedRead,
						}),
						collectionName: 'uploads',
					}),
				}),
			},
		} as unknown as IAsyncDeps;

		await getUploadMetadataController(deps)(req, {} as Response, mockNext);

		expect(mockNext).toHaveBeenCalledWith(expectedErr);
	});
});
