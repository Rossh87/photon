import { _fetchUserData } from './fetchUserData';
import { AxiosInstance } from 'axios';
import { AuthError } from '../domain/AuthError';
import { TAuthorizedUserResponse } from 'sharedTypes/User';
import { TAuthActions } from '../state/authStateTypes';

describe('user data fetching functiong', () => {
	it('dispatches correct actions for success', async () => {
		const actions: TAuthActions[] = [];
		const user = {
			name: 'tim',
			age: 20,
		};
		const dispatch = (action: any) => actions.push(action);
		const mockAxios = {
			get: jest.fn(() => Promise.resolve({ data: user })),
		} as unknown as AxiosInstance;

		const expected: TAuthActions[] = [
			{ type: 'AUTH_REQUEST_INITIATED', payload: null },
			{
				type: 'ADD_USER',
				payload: user as unknown as TAuthorizedUserResponse,
			},
		];

		await _fetchUserData(mockAxios)(dispatch);

		expect(actions.length).toBe(2);
		actions.forEach((action, i) => expect(action).toEqual(expected[i]));
	});

	it('dispatches correct error on request failure', async () => {
		const failureReason = 'failure';

		const mockAxios = {
			get: jest.fn(() => Promise.reject(failureReason)),
		} as unknown as AxiosInstance;

		const expectedAction: TAuthActions = {
			type: 'ADD_AUTH_ERR',
			payload: AuthError.create(failureReason),
		};

		const dispatch = jest.fn();

		await _fetchUserData(mockAxios)(dispatch);

		expect(dispatch).toHaveBeenNthCalledWith(2, expectedAction);
	});
});
