import { MongoClient } from 'mongodb';
import { dedupeNamesController } from './dedupeNamesController';
import { TEST_DB_URI } from '../../../CONSTANTS';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { mockUploadsFromDb } from '../helpers/mockData';
import { NextFunction, Request, Response } from 'express';
import { TDedupeNamesResponse } from '../sharedUploadTypes';

let repoClient: MongoClient;
let deps: IAsyncDeps;

beforeAll(async () => {
	repoClient = await MongoClient.connect(TEST_DB_URI, {
		useUnifiedTopology: true,
	});

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

describe('route controller to check for duplicate display names', () => {
	it('responds with JSON array of duplicates if uploads with submitted displayNames already exists in DB', async () => {
		// cast this to satify the compiler and allow us to assert on this variable later in test.
		// Setting this to an empty array makes 2nd test in this suite unreliable
		let jsonResult: TDedupeNamesResponse =
			null as unknown as TDedupeNamesResponse;

		const req = {
			session: {
				user: { _id: '1234' },
			},

			body: { displayNames: ['cats', 'dogs', 'squirrels'] },
		} as unknown as Request;

		const res = {
			json: jest.fn((x) => {
				jsonResult = x;
			}),
			status: jest.fn(),
		} as unknown as Response;

		await dedupeNamesController(deps)(req, res, jest.fn() as NextFunction);

		// note this can break if mock data changes.  We ignore the
		// _id property on the response.  In the real world, this will always
		// be the same as ownerID
		expect(jsonResult.length).toEqual(1);
		expect(jsonResult[0]).toMatchObject({
			ownerID: '1234',
			displayName: 'cats',
		});
	});

	it('responds with empty JSON array if there are no duplicates', async () => {
		let jsonResult: TDedupeNamesResponse =
			null as unknown as TDedupeNamesResponse;

		const req = {
			session: {
				user: { _id: '1234' },
			},

			body: {
				displayNames: ['gerbils', 'crickets', 'a day on the Thames'],
			},
		} as unknown as Request;

		const res = {
			json: jest.fn((x) => {
				jsonResult = x;
			}),
			status: jest.fn(),
		} as unknown as Response;

		await dedupeNamesController(deps)(req, res, jest.fn() as NextFunction);

		// note this can break if mock data changes
		expect(jsonResult.length).toEqual(0);
	});

	it("only identifies a duplicate record if record's ownerID matches request _id", async () => {
		let jsonResult: TDedupeNamesResponse =
			null as unknown as TDedupeNamesResponse;

		const req = {
			session: {
				user: { _id: '1234' },
			},

			body: {
				displayNames: ['foxes', 'beach day'],
			},
		} as unknown as Request;

		const res = {
			json: jest.fn((x) => {
				jsonResult = x;
			}),
			status: jest.fn(),
		} as unknown as Response;

		await dedupeNamesController(deps)(req, res, jest.fn() as NextFunction);

		// note this can break if mock data changes
		expect(jsonResult.length).toEqual(0);
	});
});
