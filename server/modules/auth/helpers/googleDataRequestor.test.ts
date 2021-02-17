import {
    googleDataRequestor,
    GoogleDataRequestErr,
} from './googleDataRequestor';
import { GOOGLE_PEOPLE_OAUTH_ENDPOINT } from '../../../../CONSTANTS';
import { Result } from 'ts-result';
import { AxiosInstance } from 'axios';

describe('googleDataRequestor', () => {
    it('calls "get" library method with the correct endpoint and headers', async () => {
        const mockAxios = ({
            get: jest.fn(() => Promise.resolve({ data: 'data' })),
        } as unknown) as AxiosInstance;

        const mockToken = 'abc';
        const fn = googleDataRequestor(mockAxios);
        const received = await fn(mockToken);

        expect(mockAxios.get).toHaveBeenCalledWith(
            GOOGLE_PEOPLE_OAUTH_ENDPOINT,
            { headers: { Authorization: 'Bearer abc' } }
        );
        expect(received).toEqual(Result.right('data'));
    });

    it("returns a Left(some async err) if there's a problem with response from Google", async () => {
        const httpErr = new Error('something failed');
        const mockAxios = ({
            get: jest.fn(() => Promise.reject(httpErr)),
        } as unknown) as AxiosInstance;

        const mockToken = 'abc';
        const fn = googleDataRequestor(mockAxios);
        const received = await fn(mockToken);

        expect(received).toEqual(
            Result.left(new GoogleDataRequestErr(httpErr))
        );
    });
});
