import { TAuthActions } from '../state/authStateTypes';
import { _fetchUserData } from './fetchUserData';
import { AxiosInstance } from 'axios';
import { AuthError } from '../domain/AuthError';

describe('user data fetching functiong', () => {
	it('dispatches correct actions for success', async () => {
		const actions: TAuthActions[] = [];
		const user = {
			name: 'tim',
			age: 20,
			accessLevel: 'demo',
		};
		const dispatch = (action: any) => actions.push(action);
		const mockAxios = {
			get: jest.fn(() => Promise.resolve({ data: user })),
		} as unknown as AxiosInstance;

		await _fetchUserData(mockAxios)(dispatch);

		expect(actions.length).toBe(2);
	});

	it('dispatches correct error on request failure', async () => {
		const failureReason = 'failure';

		const mockAxios = {
			get: jest.fn(() => Promise.reject(failureReason)),
		} as unknown as AxiosInstance;

		const expectedAction: TAuthActions = {
			type: 'AUTH/ADD_AUTH_ERR',
			payload: AuthError.create(failureReason),
		};

		const dispatch = jest.fn();

		await _fetchUserData(mockAxios)(dispatch);

		expect(dispatch).toHaveBeenNthCalledWith(2, expectedAction);
	});
});
