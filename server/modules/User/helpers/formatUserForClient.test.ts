import { formatUserForClient } from './formatUserForClient';
import { TDBUser, TAuthorizedUserResponse } from 'sharedTypes/User';
import { mockUserFromDatabase } from '../../auth/helpers/mockData';

let savedUser: TDBUser;

// cleanup any changes our tests make to mock data
beforeEach(() => {
	savedUser = Object.assign({}, mockUserFromDatabase);
});

describe('function to prepare user data for sending to client', () => {
	it('converts User\'s "_id" property from ObjectID to string', () => {
		const received = formatUserForClient(savedUser);

		expect(typeof received._id).toBe('string');
	});
});
