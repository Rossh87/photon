import { MongoClient, ObjectId } from 'mongodb';
import { dedupeNamesController } from './dedupeNamesController';
import { TEST_DB_URI } from '../../../CONSTANTS';
import { IAsyncDeps } from '../../../core/asyncDeps';
import {
	mockIncomingBreakpoints,
	mockObjectIDs,
	mockUploadsFromDb,
} from '../helpers/mockData';
import { NextFunction, Request, Response } from 'express';
import { TDedupeNamesResponse } from '../sharedUploadTypes';
import { IBreakpointTransferObject } from '../../../../sharedTypes/Upload';
import { mockObjectID } from '../../auth/helpers/mockData';
import { updateBreakpointsController } from './updateBreakpointsController';

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

describe('route controller to update breakpoints associated with an image', () => {
	it('updates the appropriate image correctly and responds with updated value as json', async () => {
		const _id = mockObjectIDs[0].toString();

		const mockRequestBody: IBreakpointTransferObject = {
			imageID: _id,
			breakpoints: mockIncomingBreakpoints,
		};

		const req = {
			body: mockRequestBody,
		} as unknown as Request;

		const res = {
			json: jest.fn(),
		} as unknown as Response;

		await updateBreakpointsController(deps)(
			req,
			res,
			jest.fn() as NextFunction
		);

		const hopefullyUpdated = await repoClient
			.db('photon')
			.collection('uploads')
			.findOne({ _id: new ObjectId(_id) });

		expect(hopefullyUpdated.breakpoints).toEqual(mockIncomingBreakpoints);
		expect(res.json).toHaveBeenCalledWith(hopefullyUpdated);
	});
});
