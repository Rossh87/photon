import { IGoogleOAuthResponse } from '../sharedAuthTypes';
import { IDBUser, IUser } from '../../User/sharedUserTypes';
import { ObjectId, WithId } from 'mongodb';

export const mockGoogleOAuthResponse: IGoogleOAuthResponse = {
	resourceName: 'resourceName/123456',
	etag: 'abc123',
	names: [
		{
			metadata: {
				primary: true,
				source: {
					type: 'PROFILE',
					id: '123456',
				},
			},
			displayName: 'Tim123',
			familyName: 'Roosevelt',
			givenName: 'Tim',
			displayNameLastFirst: 'Roosevelt, Tim',
			unstructuredName: 'Tim Roosevelt',
		},
	],
	emailAddresses: [
		{
			metadata: {
				primary: true,
				verified: true,
				source: {
					type: 'ACCOUNT',
					id: '123456',
				},
			},
			value: 'tim@gmail.com',
		},
	],
	photos: [
		{
			url: 'https://myphotos@myphotos.com',
			metadata: {
				primary: true,
				source: {
					type: 'PROFILE',
					id: '123456',
				},
			},
			primary: true,
		},
	],
};

export const mockUserFromGoogleResponse: IUser = {
	OAuthProviderName: 'google',
	OAuthProviderID: '123456',
	thumbnailURL: 'https://myphotos@myphotos.com',
	displayName: 'Tim123',
	familyName: 'Roosevelt',
	givenName: 'Tim',
	OAuthEmail: 'tim@gmail.com',
	OAuthEmailVerified: true,
};

const mockId = ObjectId.createFromTime(Date.now());

export const mockUserFromDatabase: WithId<IDBUser> = {
	_id: mockId,
	OAuthProviderName: 'google',
	OAuthProviderID: '123456',
	thumbnailURL: 'https://myphotos@myphotos.com',
	displayName: 'Tim123',
	familyName: 'Roosevelt',
	givenName: 'Tim',
	OAuthEmail: 'tim@gmail.com',
	OAuthEmailVerified: true,
	registeredDomains: ['mySite.com'],
	uploadUsage: 100,
	imageCount: 223,
};
