import { TDBUser } from 'sharedTypes/User';
import { ICombinedUploadRequestMetadata } from '../sharedUploadTypes';
import { saveUploadMetadataController } from './saveUploadMetadataController';
import { mockUserFromDatabase } from '../../auth/helpers/mockData';
import { Request, Response, NextFunction } from 'express';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { MongoClient } from 'mongodb';
import { DBWriteError } from '../../../core/repo';

const _mockRequestData: ICombinedUploadRequestMetadata = {
	ownerID: 'abc123',
	displayName: 'someFile.jpg',
	mediaType: 'image/jpeg',
	sizeInBytes: 1000,
	integrityHash: ['123abc', '456def'],
	availableWidths: [250, 700],
	publicPathPrefix: 'googlestorage/1234/someFile.jpg',
};

let mockRequestData: ICombinedUploadRequestMetadata;
let mockUser: TDBUser;

beforeEach(() => {
	mockRequestData = Object.assign({}, _mockRequestData);
	mockUser = Object.assign({}, mockUserFromDatabase);
});

describe('controller to save info about successful uploads', () => {
	it('adds emtpy array to "breakpoints" property before saving a new upload', async () => {
		const req = {
			session: {
				user: mockUser,
			},
			body: mockRequestData,
		} as Request;

		const mockInsert = jest.fn(() => Promise.resolve('whatever'));

		const deps = {
			repoClient: {
				db: (s: string) => ({
					collection: (t: string) => ({
						insertOne: mockInsert,
					}),
				}),
			},
		} as unknown as IAsyncDeps;

		await saveUploadMetadataController(deps)(
			req,
			{} as Response,
			jest.fn() as NextFunction
		);

		const expected = Object.assign({}, mockRequestData, {
			breakpoints: [],
		});

		expect(mockInsert).toHaveBeenCalledWith(expected);
	});

	it('updates usage metrics on session user', async () => {
		const req = {
			session: {
				user: mockUser,
			},
			body: mockRequestData,
		} as Request;

		const mockStatus = jest.fn();

		const res = {
			status: mockStatus,
			end: jest.fn(),
		} as unknown as Response;

		const mockInsert = jest.fn(() =>
			Promise.resolve({ ops: [mockRequestData] })
		);

		const deps = {
			repoClient: {
				db: (s: string) => ({
					collection: (t: string) => ({
						insertOne: mockInsert,
					}),
				}),
			},
		} as unknown as IAsyncDeps;

		await saveUploadMetadataController(deps)(
			req,
			res,
			jest.fn() as NextFunction
		);

		const expected = Object.assign(
			{ ...mockUser },
			{
				uploadUsage: 1100,
				imageCount: 6,
			}
		);

		expect(mockStatus).toHaveBeenCalledWith(200);
		expect(req.session.user).toEqual(expected);
	});

	it('passes errors to error handler', async () => {
		const req = {
			session: {
				user: mockUser,
			},
			body: mockRequestData,
		} as Request;

		const mockNext = jest.fn() as NextFunction;

		const failedToSave = Object.assign({}, mockRequestData, {
			breakpoints: [],
		});

		const expectedErr = DBWriteError.create(
			'uploads',
			failedToSave,
			'some failure reason'
		);

		const failedInsert = jest.fn(() => Promise.reject(expectedErr));

		const deps = {
			repoClient: {
				db: (s: string) => ({
					collection: (t: string) => ({
						insertOne: failedInsert,
						collectionName: 'uploads',
					}),
				}),
			},
		} as unknown as IAsyncDeps;

		await saveUploadMetadataController(deps)(req, {} as Response, mockNext);

		expect(mockNext).toHaveBeenCalledWith(expectedErr);
	});
});
