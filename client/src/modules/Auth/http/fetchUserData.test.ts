import { _fetchUserData } from './fetchUserData';
import { AxiosInstance } from 'axios';
import { AuthError } from '../domain/AuthError';
import { TAuthorizedUserResponse } from 'sharedTypes/User';
import { IAddAppMessageAction, TAuthActions } from '../state/authStateTypes';
import { createAppMessage } from '../../AppMessages/helpers';

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

		await _fetchUserData(mockAxios)(dispatch);

		expect(actions.length).toBe(3);
	});

	it('submits an app message if user is in "demo" mode', async () => {
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

		const expectedMessage = createAppMessage(
			'Photon is currently running in demo mode.  Demo users are limited to 10 uploads.',
			'info'
		);

		await _fetchUserData(mockAxios)(dispatch);

		expect((actions[1] as IAddAppMessageAction).payload.message).toEqual(
			expectedMessage.message
		);
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
