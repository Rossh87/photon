import { _fetchUserData } from './fetchUserData';
import { AxiosInstance } from 'axios';
import { AuthError } from '../domain/AuthError';
import {
	IAddAppMessageAction,
	TAuthActions,
	TSingleNoticeMessage,
} from '../state/authStateTypes';

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

		const expectedMessage = {
			type: 'ADD_APP_MESSAGE',
			payload: {
				messageKind: 'singleNotice',
				eventName: 'user profile data received',
				displayMessage:
					'Photon is currently running in demo mode.  Demo users are limited to 10 uploads.',
				severity: 'info',
				action: {
					kind: 'simple',
					handler: () => dispatch({ type: 'REMOVE_APP_MESSAGE' }),
				},
				displayTrackingProp: 'demoMessageViewed',
			},
		};

		// Convert to string to get around inequality of nested functions.
		await _fetchUserData(mockAxios)(dispatch);

		expect(JSON.stringify(actions[1])).toEqual(
			JSON.stringify(expectedMessage)
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
