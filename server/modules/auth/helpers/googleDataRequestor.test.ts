import {
    googleDataRequestor,
    GoogleDataRequestErr,
} from './googleDataRequestor';
import { GOOGLE_PEOPLE_OAUTH_ENDPOINT } from '../../../CONSTANTS';
import { AxiosInstance } from 'axios';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { IGoogleOAuthResponse } from '../sharedAuthTypes';
import { expectEqual } from '../../../core/utils/testUtils';

describe('googleDataRequestor', () => {
    it('calls "get" library method with the correct endpoint and headers', async () => {
        const mockAxios = ({
            get: jest.fn(() => Promise.resolve({ data: 'data' })),
        } as unknown) as AxiosInstance;
        const mockToken = 'abc';

        const received = googleDataRequestor(mockToken)(mockAxios);

        const test1 = TE.map<IGoogleOAuthResponse, void>(expectEqual('data'));

        await test1(received)();

        expect(mockAxios.get).toHaveBeenCalledWith(
            GOOGLE_PEOPLE_OAUTH_ENDPOINT,
            { headers: { Authorization: 'Bearer abc' } }
        );
    });

    it("returns a Left if there's a problem with response from Google", async () => {
        const httpErr = new Error('something failed');
        const mockAxios = ({
            get: jest.fn(() => Promise.reject(httpErr)),
        } as unknown) as AxiosInstance;
        const mockToken = 'abc';

        await pipe(
            googleDataRequestor(mockToken)(mockAxios),
            TE.mapLeft((e) => expectEqual(e.raw)(httpErr))
        )();
    });
});
