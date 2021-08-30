import { TEST_DB_URI, GOOGLE_PEOPLE_OAUTH_ENDPOINT } from '../../../CONSTANTS';
import { handleGoogleOAuthCallback } from './handleGoogleOAuthCallback';
import { MongoClient, WithId } from 'mongodb';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { getCollection } from '../../../core/repo';
import {
	mockGoogleOAuthResponse,
	mockUserFromGoogleResponse,
} from '../helpers/mockData';
import { IFetcher } from '../../../core/fetcher';
import { IDBUser, IUser } from '../../User/sharedUserTypes';
import { Request } from 'express';
import { IGoogleOAuthResponse } from '../sharedAuthTypes';
import { normalizeGoogleResponse } from '../helpers';
import * as E from 'fp-ts/lib/Either';

let repoClient: MongoClient;
let googleResponse = Object.assign({}, mockGoogleOAuthResponse);

const mockAxios = {
	get: jest.fn<Promise<{ data: IGoogleOAuthResponse }>, [string]>((url) => {
		const response = { data: googleResponse };
		return url === GOOGLE_PEOPLE_OAUTH_ENDPOINT
			? Promise.resolve(response)
			: Promise.reject('invalid url');
	}),
};

beforeAll(
	async () =>
		(repoClient = await MongoClient.connect(TEST_DB_URI, {
			useUnifiedTopology: true,
		}))
);

// cleanup changes to mock data between tests
beforeEach(() => (googleResponse = Object.assign({}, mockGoogleOAuthResponse)));

// cleanup changes to database between tests
afterEach(async () => await repoClient.db('photon').collection('users').drop());

// close db connection
afterAll(async () => await repoClient.close());

describe('callback fn to handle Google OAuth access token', () => {
	describe('success cases', () => {
		it('saves a new user to the database on their first authorization', async () => {
			const deps = {
				repoClient: repoClient,
				fetcher: mockAxios as unknown as IFetcher,
			} as IAsyncDeps;

			const mockRequest: Request = {
				session: {
					grant: {
						response: {
							access_token: 'supersecret',
						},
					},
				},
			} as Request;

			await handleGoogleOAuthCallback(mockRequest)(deps)();

			const saved = await getCollection<IDBUser>('users')(
				repoClient
			).findOne({
				OAuthProviderID: mockUserFromGoogleResponse.OAuthProviderID,
			});

			expect(saved).toMatchObject(mockUserFromGoogleResponse);
		});

		it.only('adds correct additional properties to a new user before first save', async () => {
			const deps = {
				repoClient: repoClient,
				fetcher: mockAxios as unknown as IFetcher,
			} as IAsyncDeps;

			const mockRequest: Request = {
				session: {
					grant: {
						response: {
							access_token: 'supersecret',
						},
					},
				},
			} as Request;

			const propsToAdd: any = {
				registeredDomains: [],
				imageCount: 0,
				accessLevel: 'demo',
				uploadUsage: 0,
			};

			const expectedSave = Object.assign<
				IUser,
				Pick<
					IDBUser,
					'registeredDomains' | 'imageCount' | 'uploadUsage'
				>
			>(mockUserFromGoogleResponse, propsToAdd);

			await handleGoogleOAuthCallback(mockRequest)(deps)();

			const saved = await getCollection<WithId<IDBUser>>('users')(
				repoClient
			).findOne({
				OAuthProviderID: mockUserFromGoogleResponse.OAuthProviderID,
			});

			expect(saved).toMatchObject(expectedSave);
		});

		it('updates an existing user correctly if incoming user has fresh data', async () => {
			// update properties on the Google user response object
			googleResponse.names[0].givenName = 'newName';
			googleResponse.emailAddresses[0].value =
				'anotherDifferentEmail@google.com';

			const deps = {
				repoClient: repoClient,
				fetcher: mockAxios as unknown as IFetcher,
			} as IAsyncDeps;

			const mockRequest: Request = {
				session: {
					grant: {
						response: {
							access_token: 'supersecret',
						},
					},
				},
			} as Request;

			await handleGoogleOAuthCallback(mockRequest)(deps)();

			const saved = await getCollection<IUser>('users')(
				repoClient
			).findOne({
				OAuthProviderID: mockUserFromGoogleResponse.OAuthProviderID,
			});

			const match = E.map<IUser, void>((u) =>
				expect(saved).toMatchObject(u)
			);

			match(normalizeGoogleResponse(googleResponse));
		});
	});
});
