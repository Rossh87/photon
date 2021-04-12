import { IDBUser } from '../../User/sharedUserTypes';
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
let mockUser: IDBUser;

beforeEach(() => {
	mockRequestData = Object.assign({}, _mockRequestData);
	mockUser = Object.assign({}, mockUserFromDatabase);
});

describe('controller to save info about successful uploads', () => {
	it('invokes db with correct arguments', async () => {
		const req = {
			session: {
				user: mockUser,
			},
			body: mockRequestData,
		} as Request;

		const mockInsert = jest.fn(() => Promise.resolve('whatever'));

		const deps = ({
			repoClient: {
				db: (s: string) => ({
					collection: (t: string) => ({
						insertOne: mockInsert,
					}),
				}),
			},
		} as unknown) as IAsyncDeps;

		await saveUploadMetadataController(deps)(
			req,
			{} as Response,
			jest.fn() as NextFunction
		);

		expect(mockInsert).toHaveBeenCalledWith(mockRequestData);
	});

	it('update usage metrics on session user', async () => {
		const req = {
			session: {
				user: mockUser,
			},
			body: mockRequestData,
		} as Request;

		const mockStatus = jest.fn();

		const res = ({ status: mockStatus } as unknown) as Response;

		const mockNext = ((args: any) => console.log(args)) as NextFunction;

		const mockInsert = jest.fn(() =>
			Promise.resolve({ ops: [mockRequestData] })
		);

		const deps = ({
			repoClient: {
				db: (s: string) => ({
					collection: (t: string) => ({
						insertOne: mockInsert,
					}),
				}),
			},
		} as unknown) as IAsyncDeps;

		await saveUploadMetadataController(deps)(req, res, mockNext);

		const expected = Object.assign(
			{ ...mockUser },
			{
				uploadUsage: 1100,
				imageCount: 224,
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

		const expectedErr = DBWriteError.create(
			'uploads',
			mockRequestData,
			'some failure reason'
		);

		const failedInsert = jest.fn(() => Promise.reject(expectedErr));

		const deps = ({
			repoClient: {
				db: (s: string) => ({
					collection: (t: string) => ({
						insertOne: failedInsert,
						collectionName: 'uploads',
					}),
				}),
			},
		} as unknown) as IAsyncDeps;

		await saveUploadMetadataController(deps)(req, {} as Response, mockNext);

		expect(mockNext).toHaveBeenCalledWith(expectedErr);
	});
});
