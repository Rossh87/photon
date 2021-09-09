import { TDBUser } from 'sharedTypes/User';
import { ICombinedUploadRequestMetadata } from 'sharedTypes/Upload';
import { getUploadMetadataController } from './getUploadMetadataController';
import {
	mockUserFromDatabase,
	mockObjectID,
} from '../../auth/helpers/mockData';
import { Request, Response, NextFunction } from 'express';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { DBReadError } from '../../../core/repo';
import { toSessionUser } from '../../../core/utils/toSessionUser';
import { MongoClient } from 'mongodb';
import { TEST_DB_URI } from '../../../CONSTANTS';
import { mockObjectIDs, mockUploadsFromDb } from '../helpers/mockData';

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
let mockUser: TDBUser;

beforeEach(() => {
	mockRequestData1 = Object.assign({}, _mockRequestData1);
	mockRequestData2 = Object.assign({}, _mockRequestData2);
	mockUser = Object.assign({}, mockUserFromDatabase);
});

let repoClient: MongoClient;
let deps: IAsyncDeps;

beforeAll(async () => {
	repoClient = await MongoClient.connect(TEST_DB_URI);

	deps = {
		repoClient,
	} as IAsyncDeps;

	const db = repoClient.db('photon').collection('uploads');

	await db.insertMany(mockUploadsFromDb);
});

// cleanup changes to database between tests
afterEach(async () => {
	const db = repoClient.db('photon').collection('uploads');
	await db.drop();
	await db.insertMany(mockUploadsFromDb);
});

// clear db for next test suite and close db connection
afterAll(async () => {
	await repoClient.db('photon').collection('uploads').drop();
	await repoClient.close();
});

describe('controller to send saved upload data to client', () => {
	it('passes errors to error handler', async () => {
		const req = {
			session: {
				user: toSessionUser(mockUser),
			},
		} as Request;

		const mockNext = jest.fn() as NextFunction;

		const expectedErr = DBReadError.create(
			'uploads',
			{},
			'some failure reason'
		);

		const failedRead = jest.fn(() => Promise.reject(expectedErr));

		const deps = {
			repoClient: {
				db: (s: string) => ({
					collection: (t: string) => ({
						aggregate: () => ({
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

	describe('retrieval aggregation query', () => {
		it('adds an "addedOn" property', async () => {
			const req = {
				session: {
					user: {
						_id: '0472',
					},
				},
			} as unknown as Request;

			const res = {
				status: jest.fn(),
				json: jest.fn(),
			} as unknown as Response;

			// note 'deps' here is from global scope, with real db access
			await getUploadMetadataController(deps)(req, res, jest.fn());

			const expectedResponse = {
				...mockUploadsFromDb[0],
				_id: mockObjectIDs[0],
				addedOn: mockObjectIDs[0].getTimestamp(),
			};
			expect(res.json).toHaveBeenCalledWith([expectedResponse]);
		});
	});
});
