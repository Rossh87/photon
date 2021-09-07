import {
	IUserProfilePreferencesTransportObject,
	TDBUser,
	TProfileErrorsTransportObject,
} from 'sharedTypes/User';
import { mockUserFromDatabase } from '../../auth/helpers/mockData';
import { Request, Response, NextFunction } from 'express';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { MongoClient, ObjectId } from 'mongodb';
import { TEST_DB_URI } from '../../../CONSTANTS';
import { updateUserProfilePreferencesController } from './updateUserProfilePreferencesController';
import { DBUpdateError } from '../../../core/repo';
import { string } from 'io-ts';

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

	mockUser = { ...mockUserFromDatabase };
});

describe("controller to update user's profile preferences", () => {
	it('sets preferences on DB user and session user correctly', async () => {
		const newPreferences: IUserProfilePreferencesTransportObject = {
			preferredDisplayName: 'gus-gustavson',
			preferredThumbnailURL: 'http://www.soemphoto.com',
		};

		const stringID = mockUser._id.toString();

		// TODO: constantly converting this _id type is a MONSTER hassle
		const req = {
			session: {
				user: {
					...mockUser,
					_id: stringID,
				} as unknown as TDBUser,
			},
			body: newPreferences,
		} as Request;

		const res = {
			status: jest.fn(),
			end: jest.fn(),
			json: jest.fn((e) => console.log(e)),
		} as unknown as Response;

		await updateUserProfilePreferencesController(deps)(
			req,
			res,
			jest.fn() as NextFunction
		);

		const expectedUser: TDBUser = {
			...mockUserFromDatabase,
			userPreferences: { ...newPreferences },
		};

		const dbUser = await repoClient
			.db('photon')
			.collection('users')
			.findOne({ _id: mockUser._id });

		// check database state
		expect(dbUser).toEqual(expectedUser);

		// check response behaviors
		expect(res.status).toHaveBeenCalledWith(204);
		expect(req.session.user).toEqual({ ...dbUser, _id: stringID });
	});

	it('passes database failures to the error handler', async () => {
		const stringID = mockUser._id.toString();
		const req = {
			session: {
				user: { ...mockUser, _id: stringID } as unknown as TDBUser,
			},
			// Body property must be set to pass validation
			body: {},
		} as Request;

		const mockNext = jest.fn() as NextFunction;

		const expectedErr = DBUpdateError.create(
			'users',
			{ _id: mockUser._id },
			'some failure reason'
		);

		const deps = {
			repoClient: {
				db: (s: string) => ({
					collection: (t: string) => ({
						findOneAndUpdate: () =>
							Promise.reject('some failure reason'),
						collectionName: 'users',
					}),
				}),
			},
		} as unknown as IAsyncDeps;

		await updateUserProfilePreferencesController(deps)(
			req,
			{} as Response,
			mockNext
		);

		expect(mockNext).toHaveBeenCalledWith(expectedErr);
	});

	it('responds with formatted JSON if new preferences fail validation', async () => {
		const newPreferences: IUserProfilePreferencesTransportObject = {
			// display name is invalid
			preferredDisplayName: '!*--%&*',
			preferredThumbnailURL: 'http://www.soemphoto.com',
		};

		const req = {
			session: {
				user: mockUser,
			},
			body: newPreferences,
		} as Request;

		const mockStatus = jest.fn();
		const mockJSON = jest.fn();

		const res = {
			status: mockStatus,
			json: mockJSON,
		} as unknown as Response;

		// This never gets hit if input data is invalid
		const deps = {
			repoClient: {
				db: (s: string) => ({
					collection: (t: string) => ({
						findOneAndUpdate: () =>
							Promise.reject('some failure reason'),
						collectionName: 'users',
					}),
				}),
			},
		} as unknown as IAsyncDeps;

		const expectedResponse: TProfileErrorsTransportObject = {
			preferredDisplayName:
				'Username must be an alphanumeric string or "-" or "." between 5 and 30 characters',
		};

		await updateUserProfilePreferencesController(deps)(req, res, jest.fn());

		expect(mockStatus).toHaveBeenCalledWith(400);
		expect(mockJSON).toHaveBeenCalledWith(expectedResponse);
	});
});
