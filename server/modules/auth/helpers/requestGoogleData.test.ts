import { requestGoogleData, GoogleDataRequestErr } from './requestGoogleData';
import { GOOGLE_PEOPLE_OAUTH_ENDPOINT } from '../../../CONSTANTS';
import { AxiosInstance } from 'axios';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { IGoogleOAuthResponse } from '../sharedAuthTypes';
import { expectEqual } from '../../../core/utils/testUtils';
import { IAsyncDeps } from '../../../core/asyncDeps';

describe('requestGoogleData', () => {
	it('calls "get" library method with the correct endpoint and headers', async () => {
		const deps = ({
			fetcher: {
				get: jest.fn(() => Promise.resolve({ data: 'data' })),
			},
		} as unknown) as IAsyncDeps;
		const mockToken = 'abc';

		const received = requestGoogleData(mockToken)(deps);

		const test1 = TE.map<IGoogleOAuthResponse, void>(expectEqual('data'));

		await test1(received)();

		expect(deps.fetcher.get).toHaveBeenCalledWith(
			GOOGLE_PEOPLE_OAUTH_ENDPOINT,
			{
				headers: { Authorization: 'Bearer abc' },
			}
		);
	});

	it("returns a Left if there's a problem with response from Google", async () => {
		const httpErr = new Error('something failed');
		const deps = ({
			fetcher: {
				get: jest.fn(() => Promise.reject(httpErr)),
			},
		} as unknown) as IAsyncDeps;
		const mockToken = 'abc';

		await pipe(
			requestGoogleData(mockToken)(deps),
			TE.mapLeft((e) => expectEqual(e.raw)(httpErr))
		)();
	});
});
