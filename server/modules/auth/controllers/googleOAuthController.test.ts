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
import { googleOAuthController } from './googleOAuthController';
import { MissingOAuthTokenErr } from '../helpers/extractOAuthToken';
import { dropCollections } from '../../../core/utils/testUtils';
import { GoogleDataRequestErr } from '../helpers/googleDataRequestor';

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
beforeEach(async () => await dropCollections(repoClient, ['users']));

// close db connection
afterAll(async () => await repoClient.close());

describe('google OAuth callback controller', () => {
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

        const res = ({ redirect: jest.fn() } as unknown) as Response;

        const next = jest.fn();

        const deps: IAsyncDeps = {
            repoClient: repoClient,
            fetcher: (mockAxios as unknown) as IFetcher,
        };

        await googleOAuthController(deps)(req, res, next);

        expect(req.session.user).toMatchObject(mockUserFromGoogleResponse);
        expect(res.redirect).toHaveBeenCalledWith('/');
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

        const deps: IAsyncDeps = {
            repoClient: repoClient,
            fetcher: (mockAxios as unknown) as IFetcher,
        };

        const missingTokenErr = new MissingOAuthTokenErr(
            'OAuth authorization callback reached, but no access token was present in the response'
        );

        await googleOAuthController(deps)(reqWithoutToken, res, next);

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

        const deps: IAsyncDeps = {
            repoClient: repoClient,
            fetcher: (brokenFetcher as unknown) as IFetcher,
        };

        const failedExternalRequestErr = new GoogleDataRequestErr(
            'this fetcher is broken'
        );

        await googleOAuthController(deps)(req, res, next);

        expect(req.session.user).toBe(undefined);
        expect(next).toHaveBeenCalledWith(failedExternalRequestErr);
    });
});
