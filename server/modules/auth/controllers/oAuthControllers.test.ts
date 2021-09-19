import { TEST_DB_URI, GOOGLE_PEOPLE_OAUTH_ENDPOINT } from '../../../CONSTANTS';
import { MongoClient } from 'mongodb';
import { IAsyncDeps } from '../../../core/asyncDeps';
import {
	mockGoogleOAuthResponse,
	mockUserFromGoogleResponse,
} from '../helpers/mockData';
import { IFetcher } from '../../../core/fetcher';
import { Request, Response, NextFunction } from 'express';
import { IGoogleOAuthResponse } from '../sharedAuthTypes';
import { MissingOAuthTokenErr } from '../helpers/extractOAuthToken';
import { dropCollections } from '../../../core/utils/testUtils';
import { CLIENT_ROOT } from '../../../CONSTANTS';
import { makeOAuthCallbackController } from './makeOAuthCallbackController';
import { oAuthCallbackConfigs } from './oAuthCallbackConfigs';
import { OAuthDataRequestError } from '../domain/OAuthDataRequestError';
import { getCollection } from '../../../core/repo';
import { TDBUser, TUser } from '../../../../sharedTypes/User';

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

beforeAll(async () => (repoClient = await MongoClient.connect(TEST_DB_URI)));

// cleanup changes to mock data between tests
beforeEach(() => (googleResponse = Object.assign({}, mockGoogleOAuthResponse)));

// cleanup changes to database between tests
beforeEach(async () => await dropCollections(repoClient, ['users']));

// close db connection
afterAll(async () => await repoClient.close());

describe('factory-provided OAuth callback controller', () => {
	it('sets req.session.user and redirects to root on successful auth attempts', async () => {
		const req: Request = {
			session: {
				grant: {
					response: {
						access_token: 'supersecret',
					},
				},
			},
		} as Request;

		const res = { redirect: jest.fn() } as unknown as Response;

		const next = jest.fn();

		const deps = {
			repoClient: repoClient,
			fetcher: mockAxios as unknown as IFetcher,
		} as IAsyncDeps;

		const mockGoogleController = makeOAuthCallbackController(
			oAuthCallbackConfigs.google
		)(deps);

		await mockGoogleController(req, res, next);

		expect(req.session.user).toMatchObject(mockUserFromGoogleResponse);
		expect(res.redirect).toHaveBeenCalledTimes(1);
	});

	it('calls "next" with the appropriate error (part 1)', async () => {
		const reqWithoutToken: Request = {
			session: {
				grant: {
					response: {},
				},
			},
		} as Request;

		const res = {} as Response;

		const next = jest.fn() as NextFunction;

		const deps = {
			repoClient: repoClient,
			fetcher: mockAxios as unknown as IFetcher,
		} as IAsyncDeps;

		const missingTokenErr = new MissingOAuthTokenErr(
			'OAuth authorization callback reached, but no access token was present in the response'
		);

		const mockGoogleController = makeOAuthCallbackController(
			oAuthCallbackConfigs.google
		)(deps);

		await mockGoogleController(reqWithoutToken, res, next);

		expect(reqWithoutToken.session.user).toBe(undefined);
		expect(next).toHaveBeenCalledWith(missingTokenErr);
	});

	it('calls "next" with the appropriate error (part 2)', async () => {
		const req: Request = {
			session: {
				grant: {
					response: {
						access_token: 'supersecret',
					},
				},
			},
		} as Request;

		const brokenFetcher = {
			get: () => Promise.reject('this fetcher is broken'),
		};

		const res = {} as Response;

		const next = jest.fn() as NextFunction;

		const deps = {
			repoClient: repoClient,
			fetcher: brokenFetcher as unknown as IFetcher,
		} as IAsyncDeps;

		const failedExternalRequestErr = new OAuthDataRequestError(
			'google',
			'this fetcher is broken'
		);

		const mockGoogleController = makeOAuthCallbackController(
			oAuthCallbackConfigs.google
		)(deps);

		await mockGoogleController(req, res, next);

		expect(req.session.user).toBe(undefined);
		expect(next).toHaveBeenCalledWith(failedExternalRequestErr);
	});

	describe('when it interacts with the database', () => {
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

			// provide this to prevent handler from erroring when it tries to call it
			// at the end of its lifecycle
			const mockResponse = {
				redirect: jest.fn(),
			} as unknown as Response;

			const mockGoogleController = makeOAuthCallbackController(
				oAuthCallbackConfigs.google
			)(deps);

			await mockGoogleController(
				mockRequest,
				mockResponse,
				{} as NextFunction
			);

			const saved = await getCollection<TDBUser>('users')(
				repoClient
			).findOne({
				identityProviderID:
					mockUserFromGoogleResponse.identityProviderID,
			});

			expect(saved).toMatchObject(mockUserFromGoogleResponse);
		});

		it('adds correct additional properties to a new user before first save', async () => {
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

			// provide this to prevent handler from erroring when it tries to call it
			// at the end of its lifecycle
			const mockResponse = {
				redirect: jest.fn(),
			} as unknown as Response;

			const propsToAdd = {
				registeredDomains: [],
				imageCount: 0,
				accessLevel: 'demo' as const,
				uploadUsage: 0,
			};

			const expectedSave: TUser = Object.assign(
				mockUserFromGoogleResponse,
				propsToAdd
			);

			const mockGoogleController = makeOAuthCallbackController(
				oAuthCallbackConfigs.google
			)(deps);

			await mockGoogleController(
				mockRequest,
				mockResponse,
				{} as NextFunction
			);

			const saved = await getCollection<TDBUser>('users')(
				repoClient
			).findOne({
				identityProviderID:
					mockUserFromGoogleResponse.identityProviderID,
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

			// provide this to prevent handler from erroring when it tries to call it
			// at the end of its lifecycle
			const mockResponse = {
				redirect: jest.fn(),
			} as unknown as Response;

			const mockGoogleController = makeOAuthCallbackController(
				oAuthCallbackConfigs.google
			)(deps);

			await mockGoogleController(
				mockRequest,
				mockResponse,
				{} as NextFunction
			);

			const saved = await getCollection<TDBUser>('users')(
				repoClient
			).findOne({
				identityProviderID:
					mockUserFromGoogleResponse.identityProviderID,
			});

			expect(saved?.registeredEmail).toBe(
				'anotherDifferentEmail@google.com'
			);
			expect(saved?.givenName).toBe('newName');
		});
	});
});
