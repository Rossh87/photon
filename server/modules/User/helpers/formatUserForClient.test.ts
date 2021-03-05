import { formatUserForClient } from './formatUserForClient';
import { IDBUser, IAuthorizedUserResponse } from '../sharedUserTypes';
import { mockUserFromDatabase } from '../../auth/helpers/mockData';
import { WithId } from 'mongodb';

let savedUser: WithId<IDBUser>;

// cleanup any changes our tests make to mock data
beforeEach(() => {
	savedUser = Object.assign({}, mockUserFromDatabase);
});

describe('function to prepare user data for sending to client', () => {
	it('formats the data into a new object with the correct shape/data', () => {
		const expected: IAuthorizedUserResponse = {
			OAuthProviderName: 'google',
			thumbnailURL: 'https://myphotos@myphotos.com',
			displayName: 'Tim123',
			familyName: 'Roosevelt',
			givenName: 'Tim',
			emailAddress: 'tim@gmail.com',
			_id: savedUser._id.toHexString(),
		};

		const received = formatUserForClient(savedUser);

		expect(received).toEqual(expected);
	});

	it('converts User\'s "_id" property from ObjectID to string', () => {
		const received = formatUserForClient(savedUser);

		expect(typeof received._id).toBe('string');
	});
});
