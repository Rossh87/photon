import { TDBUser } from 'sharedTypes/User';
import { ICombinedUploadRequestMetadata } from '../sharedUploadTypes';
import { saveUploadMetadataController } from './saveUploadMetadataController';
import { mockUserFromDatabase } from '../../auth/helpers/mockData';
import { mockCombinedUploadRequest } from '../helpers/mockData';
import { Request, Response, NextFunction } from 'express';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { MongoClient, ObjectId } from 'mongodb';
import { DBWriteError } from '../../../core/repo';
import { TEST_DB_URI } from '../../../CONSTANTS';

let mockRequestData: ICombinedUploadRequestMetadata;
let mockUser: TDBUser;
let repoClient: MongoClient;
let deps: IAsyncDeps;

beforeAll(async () => {
	repoClient = await MongoClient.connect(TEST_DB_URI, {
		useUnifiedTopology: true,
	});

	deps = {
		repoClient,
	} as IAsyncDeps;
});

// cleanup changes to database between tests
afterEach(async () => {
	await repoClient.db('photon').collection('uploads').drop();
	await repoClient.db('photon').collection('users').drop();
});

// clear db for next test suite and close db connection
afterAll(async () => {
	await repoClient.close();
});

beforeEach(async () => {
	// add an existing user object to check updates against
	await repoClient
		.db('photon')
		.collection('users')
		.insertOne(mockUserFromDatabase);

	mockRequestData = { ...mockCombinedUploadRequest };
	mockUser = { ...mockUserFromDatabase };
});

describe('controller to save info about successful uploads', () => {
	it.only('persists correct info to db', async () => {
		// we HAVE to set mock request data's ownerID prop to be the same
		// as that of our mockUser
		const mockRequest = { ...mockRequestData, ownerID: mockUser._id };

		const req = {
			session: {
				user: mockUser,
			},
			body: mockRequest,
		} as Request;

		const res = {
			status: jest.fn(),
			end: jest.fn(),
		} as unknown as Response;

		await saveUploadMetadataController(deps)(
			req,
			res,
			jest.fn() as NextFunction
		);

		const expectedUser: TDBUser = Object.assign({}, mockUserFromDatabase, {
			imageCount: mockUserFromDatabase.imageCount + 1,
			uploadUsage:
				mockUserFromDatabase.uploadUsage +
				mockCombinedUploadRequest.sizeInBytes,
		});

		const expectedUpload: any = {
			...mockRequest,
			breakpoints: [],
		};

		const expectedSessionUser = Object.assign(
			{ ...mockUser },
			{
				uploadUsage: 1100,
				imageCount: 6,
			}
		);

		const dbUser = await repoClient
			.db('photon')
			.collection('users')
			.findOne({ _id: mockUser._id });

		const dbUpload = await repoClient
			.db('photon')
			.collection('uploads')
			.findOne({ ownerID: mockUserFromDatabase._id });

		// check database state
		expect(dbUser).toEqual(expectedUser);
		expect(dbUpload).toMatchObject(expectedUpload);

		// check response behaviors
		expect(res.status).toHaveBeenCalledWith(200);
		expect(req.session.user).toEqual(expectedSessionUser);
	});

	// it.only('updates usage metrics on session user', async () => {
	// 	const req = {
	// 		session: {
	// 			user: mockUser,
	// 		},
	// 		body: mockRequestData,
	// 	} as Request;

	// 	const mockStatus = jest.fn();

	// 	const res = {
	// 		status: mockStatus,
	// 		end: jest.fn(),
	// 	} as unknown as Response;

	// 	const mockInsert = jest.fn(() =>
	// 		Promise.resolve({ ops: [mockRequestData] })
	// 	);

	// 	const mockDeps = {
	// 		repoClient: {
	// 			db: (s: string) => ({
	// 				collection: (t: string) => ({
	// 					insertOne: mockInsert,
	// 				}),
	// 			}),
	// 		},
	// 	} as unknown as IAsyncDeps;

	// 	await saveUploadMetadataController(mockDeps)(
	// 		req,
	// 		res,
	// 		jest.fn() as NextFunction
	// 	);

	// 	const expected = Object.assign(
	// 		{ ...mockUser },
	// 		{
	// 			uploadUsage: 1100,
	// 			imageCount: 6,
	// 		}
	// 	);

	// 	expect(mockStatus).toHaveBeenCalledWith(200);
	// 	expect(req.session.user).toEqual(expected);
	// });

	// it('passes errors to error handler', async () => {
	// 	const req = {
	// 		session: {
	// 			user: mockUser,
	// 		},
	// 		body: mockRequestData,
	// 	} as Request;

	// 	const mockNext = jest.fn() as NextFunction;

	// 	const failedToSave = Object.assign({}, mockRequestData, {
	// 		breakpoints: [],
	// 	});

	// 	const expectedErr = DBWriteError.create(
	// 		'uploads',
	// 		failedToSave,
	// 		'some failure reason'
	// 	);

	// 	const failedInsert = jest.fn(() => Promise.reject(expectedErr));

	// 	const deps = {
	// 		repoClient: {
	// 			db: (s: string) => ({
	// 				collection: (t: string) => ({
	// 					insertOne: failedInsert,
	// 					collectionName: 'uploads',
	// 				}),
	// 			}),
	// 		},
	// 	} as unknown as IAsyncDeps;

	// 	await saveUploadMetadataController(deps)(req, {} as Response, mockNext);

	// 	expect(mockNext).toHaveBeenCalledWith(expectedErr);
	// });
});
