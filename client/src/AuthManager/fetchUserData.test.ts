import { _fetchUserData } from './fetchUserData';
import { AxiosInstance } from 'axios';
import { AuthError } from './AuthErrors';
import { IUser, TAuthActions } from './authTypes';

describe('user data fetching functiong', () => {
    it('dispatches correct actions for success', async () => {
        const actions: TAuthActions[] = [];
        const user = {
            name: 'tim',
            age: 20,
        };
        const dispatch = (action: any) => actions.push(action);
        const mockAxios = ({
            get: jest.fn(() => Promise.resolve({ data: user })),
        } as unknown) as AxiosInstance;

        const expected: TAuthActions[] = [
            { type: 'AUTH_REQUEST_INITIATED', data: null },
            {
                type: 'ADD_USER',
                data: (user as unknown) as IUser,
            },
        ];

        await _fetchUserData(mockAxios)(dispatch);

        expect(actions.length).toBe(2);
        actions.forEach((action, i) => expect(action).toEqual(expected[i]));
    });

    it('dispatches correct error on request failure', async () => {
        const failureReason = 'failure';

        const mockAxios = ({
            get: jest.fn(() => Promise.reject(failureReason)),
        } as unknown) as AxiosInstance;

        const expectedAction: TAuthActions = {
            type: 'ADD_AUTH_ERR',
            data: AuthError.create(failureReason),
        };

        const dispatch = jest.fn();

        await _fetchUserData(mockAxios)(dispatch);

        expect(dispatch).toHaveBeenNthCalledWith(2, expectedAction);
    });
});
