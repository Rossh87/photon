import { MongoClient, ObjectId } from 'mongodb';
import { dedupeNamesController } from './dedupeNamesController';
import { TEST_DB_URI } from '../../../CONSTANTS';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { mockUploadsFromDb } from '../helpers/mockData';
import { NextFunction, Request, Response } from 'express';
import { TDedupeNamesResponse } from '../sharedUploadTypes';
import { mockUserFromDatabase } from '../../auth/helpers/mockData';
import { TDBUser } from '../../../../sharedTypes/User';
import { deleteUploadController } from './deleteUploadController';
import { toSessionUser } from '../../../core/utils/toSessionUser';
import {
	IDBUpload,
	IUploadDeletionPayload,
} from '../../../../sharedTypes/Upload';
import { makeReadEnv } from '../../../core/readEnv';
import { gcsFileNamesFromUpload } from '../../../core/utils/gcsFileNamesFromUpload';

let repoClient: MongoClient;
let deps: IAsyncDeps;
let mockUpload: IDBUpload;
let mockUser: TDBUser;

// we need upload's ownerID and user's _id to be the same
// throughout our tests
const persistentOwnerID = new ObjectId();

const prepUploadMock = (u: IDBUpload): IDBUpload => ({
	...u,
	ownerID: persistentOwnerID.toHexString(),
});
const prepUserMock = (u: TDBUser): TDBUser => ({
	...u,
	_id: persistentOwnerID,
});

beforeAll(async () => {
	repoClient = await MongoClient.connect(TEST_DB_URI);

	deps = {
		repoClient,
	} as IAsyncDeps;

	const uploadDB = repoClient.db('photon').collection('uploads');
	const userDB = repoClient.db('photon').collection('users');

	const preppedUploadMock = prepUploadMock(mockUploadsFromDb[0]);
	const preppedUserMock = prepUserMock(mockUserFromDatabase);

	await uploadDB.insertOne(preppedUploadMock);
	await userDB.insertOne(preppedUserMock);

	mockUpload = preppedUploadMock;
	mockUser = preppedUserMock;
});

afterEach(async () => {
	const uploadDB = repoClient.db('photon').collection('uploads');
	const userDB = repoClient.db('photon').collection('users');

	await uploadDB.drop();
	await uploadDB.insertOne(prepUploadMock(mockUploadsFromDb[0]));

	await userDB.drop();
	await userDB.insertOne(prepUserMock(mockUserFromDatabase));
});

afterAll(async () => {
	await repoClient.db('photon').collection('uploads').drop();
	await repoClient.db('photon').collection('users').drop();

	await repoClient.close();
});

describe('controlller responsible for deleting uploads', () => {
	it('updates user and upload collections correctly', async () => {
		// notice we need user _id from session to match
		// ownerID of mock upload object
		const req = {
			session: {
				user: toSessionUser(mockUser),
			},
			params: { id: mockUpload._id },
			query: { updatedImageCount: 4 },
		} as unknown as Request<
			{ id: string },
			any,
			any,
			{ updatedImageCount: string }
		>;

		const res = {
			status: jest.fn(),
			end: jest.fn(),
		} as unknown as Response;

		const expectedNames = gcsFileNamesFromUpload(mockUpload);

		const mockDelete = jest.fn(() => {
			return Promise.resolve('cool');
		});

		const file = jest.fn((fileName: string) =>
			expectedNames.includes(fileName)
				? { delete: mockDelete }
				: {
						delete: () => {
							throw new Error('invalid file name passed to GCS');
						},
				  }
		);

		const bucket = jest.fn(() => ({
			file,
		}));

		const deps = {
			readEnv: makeReadEnv(['GOOGLE_STORAGE_BUCKET_NAME'], {
				GOOGLE_STORAGE_BUCKET_NAME: 'my-bucket',
			}),
			gcs: {
				bucket,
			},
			repoClient,
		} as unknown as IAsyncDeps;

		await deleteUploadController(deps)(req, res, jest.fn());

		// verify HTTP behaviors
		expect(req.session.user?.imageCount).toEqual(mockUser.imageCount - 1);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.end).toHaveBeenCalled();

		// verify db operations
		const updatedUser = await repoClient
			.db('photon')
			.collection<TDBUser>('users')
			.findOne({ _id: mockUser._id });

		const updatedUploads = await repoClient
			.db('photon')
			.collection<IDBUpload>('uploads')
			.findOne({ _id: mockUpload._id });

		expect(updatedUser?.imageCount).toEqual(mockUser.imageCount - 1);

		expect(updatedUploads).toBeNull();

		// verify GCS behaviors
		expect(deps.gcs.bucket).toHaveBeenCalledWith('my-bucket');
		expect(mockDelete).toHaveBeenCalledTimes(
			mockUpload.availableWidths.length
		);
	});
});
