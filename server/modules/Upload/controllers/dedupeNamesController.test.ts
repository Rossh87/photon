import { MongoClient } from 'mongodb';
import { dedupeNamesController } from './dedupeNamesController';
import { TEST_DB_URI } from '../../../CONSTANTS';
import { IAsyncDeps } from '../../../core/asyncDeps';

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
afterEach(
	async () => await repoClient.db('photon').collection('uploads').drop()
);

// close db connection
afterAll(async () => await repoClient.close());

describe('route controller to check for duplicate display names', () => {
	it('returns array of docs with matched displayNames', () => {});
});
