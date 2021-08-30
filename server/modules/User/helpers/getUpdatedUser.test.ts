import { getUpdatedUser } from './getUpdatedUser';
import {
	mockUserFromDatabase,
	mockIncomingOAuthUserData,
} from '../../auth/helpers/mockData';
import { TDBUser, IUserProfileProperties } from 'sharedTypes/User';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/lib/Either';

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

		const received = getUpdatedUser(savedUser)(incoming);

		pipe(
			received,
			E.fold(
				() => {
					throw new Error('this should never be called');
				},
				(result) => expect(result.displayName).toEqual('newName')
			)
		);
	});

	it('retains the same _id property even if updates are made', () => {
		const incoming: IUserProfileProperties = Object.assign(
			{},
			mockIncomingOAuthUserData
		);

		Object.defineProperty(incoming, 'displayName', { value: 'newName' });

		const received = getUpdatedUser(savedUser)(incoming);

		pipe(
			received,
			E.fold(
				() => {
					throw new Error('this should never be called');
				},
				(result) => expect(result._id).toEqual(savedUser._id)
			)
		);
	});

	it('passes the saved user data through if there are no updates', () => {
		const incoming: IUserProfileProperties = Object.assign(
			{},
			mockIncomingOAuthUserData
		);

		const received = getUpdatedUser(savedUser)(incoming);

		pipe(
			received,
			E.fold(
				(result) => expect(result).toEqual(savedUser),
				() => {
					throw new Error('this should never be called');
				}
			)
		);
	});
});
