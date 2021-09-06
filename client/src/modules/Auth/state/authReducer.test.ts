import { authReducer } from './authState';
import { IAuthState, TAuthActions } from './authStateTypes';
import { createAppMessage } from '../../AppMessages/helpers';

describe('application auth reducer', () => {
	it("prevents re-adding app messages that don't allow duplicates", () => {
		const initState: IAuthState = {
			appMessages: [],
		} as unknown as IAuthState;

		const msgOne = createAppMessage('message!', 'info', false);
		const actionOne: TAuthActions = {
			type: 'ADD_APP_MESSAGE',
			payload: msgOne,
		};

		const firstState = authReducer(initState, actionOne);

		expect(firstState.appMessages[0]).toEqual(msgOne);

		const msgTwo = createAppMessage('message!', 'info', false);
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
});
