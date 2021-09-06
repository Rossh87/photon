import { authReducer } from './authState';
import { IAuthState, TAuthActions } from './authStateTypes';
import { createAppMessage } from '../../AppMessages/helpers';

describe('application auth reducer', () => {
	it("prevents re-adding app messages that don't allow duplicates", () => {
		const initState: IAuthState = {
			appMessages: [],
		} as unknown as IAuthState;

		const msgOne = createAppMessage('message!', 'info', false, 'other');
		const actionOne: TAuthActions = {
			type: 'ADD_APP_MESSAGE',
			payload: msgOne,
		};

		const firstState = authReducer(initState, actionOne);

		expect(firstState.appMessages[0]).toEqual(msgOne);

		const msgTwo = createAppMessage('message!', 'info', false, 'other');
		const actionTwo: TAuthActions = {
			type: 'ADD_APP_MESSAGE',
			payload: msgTwo,
		};

		const nextState = authReducer(firstState, actionTwo);

		// verify we didn't add a message
		expect(nextState.appMessages.length).toEqual(1);
		// verify it's still the first message in the queue
		expect(nextState.appMessages[0]).toEqual(msgOne);
	});

	it('sets "demoMessageViewed" to true once a demo-mode message has been displayed', () => {
		const initState: IAuthState = {
			appMessages: [],
			demoMessageViewed: false,
		} as unknown as IAuthState;

		const msgOne = createAppMessage('message!', 'info', false, 'demo');
		const actionOne: TAuthActions = {
			type: 'ADD_APP_MESSAGE',
			payload: msgOne,
		};

		const result = authReducer(initState, actionOne);

		expect(result.appMessages[0]).toEqual(msgOne);
		expect(result.demoMessageViewed).toBe(true);
	});

	it('ignores subsequent demo messages', () => {
		const initState: IAuthState = {
			appMessages: [],
			demoMessageViewed: false,
		} as unknown as IAuthState;

		const msgOne = createAppMessage('message!', 'info', false, 'demo');
		const actionOne: TAuthActions = {
			type: 'ADD_APP_MESSAGE',
			payload: msgOne,
		};

		const firstState = authReducer(initState, actionOne);

		const msgTwo = createAppMessage('message!', 'info', false, 'demo');
		const actionTwo: TAuthActions = {
			type: 'ADD_APP_MESSAGE',
			payload: msgTwo,
		};

		const result = authReducer(firstState, actionTwo);

		expect(result.appMessages.length).toBe(1);
		expect(result.appMessages[0]).toEqual(msgOne);
	});
});
