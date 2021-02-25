import { _fetchUserData } from './fetchUserData';
import { AUTH_API_ENDPOINT } from '../../CONSTANTS';
import { AxiosInstance } from 'axios';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { AuthError } from './AuthErrors';

describe('user data fetching functiong', () => {
    it('invokes fetch library with correct URL', async () => {
        const mockAxios = ({
            get: jest.fn(() => Promise.resolve({ data: 'someData' })),
        } as unknown) as AxiosInstance;

        await _fetchUserData(mockAxios)();

        expect(mockAxios.get).toHaveBeenCalledWith(AUTH_API_ENDPOINT);
    });

    it('extracts user data from response', async () => {
        const mockUser = {
            name: 'tim',
            age: 22,
        };

        const mockAxios = ({
            get: jest.fn(() => Promise.resolve({ data: mockUser })),
        } as unknown) as AxiosInstance;

        await pipe(
            _fetchUserData(mockAxios),
            TE.map((usr) => expect(usr).toEqual(mockUser))
        )();
    });

    it('handles request failure with correct error', async () => {
        const failureReason = 'failure';

        const mockAxios = ({
            get: jest.fn(() => Promise.reject(failureReason)),
        } as unknown) as AxiosInstance;

        const expectedErr = AuthError.create(failureReason);

        await pipe(
            _fetchUserData(mockAxios),
            TE.mapLeft((e) => expect(e).toEqual(expectedErr))
        )();
    });
});
