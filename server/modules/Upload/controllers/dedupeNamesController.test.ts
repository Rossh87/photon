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
	it('returns array of docs with matched displayNames', async () => {
		let jsonResult: TDedupeNamesResponse = [];

		const req = {
			session: {
				user: { _id: '1234' },
			},

			body: { displayNames: ['cats', 'dogs', 'squirrels'] },
		} as unknown as Request;

		const res = {
			json: jest.fn((x) => {
				// hackity-hack
				jsonResult = jsonResult.concat(x);
			}),
			status: jest.fn(),
		} as unknown as Response;

		await dedupeNamesController(deps)(req, res, jest.fn() as NextFunction);

		// note this can break if mock data changes
		expect(jsonResult.length).toEqual(1);
		expect(jsonResult[0].displayName).toBe('cats');
	});
});
