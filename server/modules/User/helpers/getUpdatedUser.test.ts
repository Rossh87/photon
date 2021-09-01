import { getUpdatedUser } from './getUpdatedUser';
import {
	mockUserFromDatabase,
	mockIncomingOAuthUserData,
} from '../../auth/helpers/mockData';
import { TDBUser, IUserProfileProperties } from 'sharedTypes/User';

let savedUser: TDBUser;
beforeEach(() => {
	savedUser = Object.assign({}, mockUserFromDatabase);
});

describe('function to merge current OAuth user data with saved user data', () => {
	it('replaces saved data on User object with fresher OAuth response data', () => {
		const incoming: IUserProfileProperties = Object.assign(
			{},
			mockIncomingOAuthUserData
		);

		Object.defineProperty(incoming, 'displayName', { value: 'newName' });

		const received = getUpdatedUser(incoming)(mockUserFromDatabase);

		expect(received.displayName).toEqual('newName');
		expect(received.userPreferences).toEqual(
			mockUserFromDatabase.userPreferences
		);
		expect(received._id).toEqual(mockUserFromDatabase._id);
	});
});
