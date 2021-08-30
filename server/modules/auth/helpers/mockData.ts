import { IGoogleOAuthResponse } from '../sharedAuthTypes';
import { TDBUser, IUserProfileProperties } from 'sharedTypes/User';
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

export const mockUserFromGoogleResponse: IUserProfileProperties = {
	OAuthProviderName: 'google',
	OAuthProviderID: '123456',
	thumbnailURL: 'https://myphotos@myphotos.com',
	displayName: 'Tim123',
	familyName: 'Roosevelt',
	givenName: 'Tim',
	OAuthEmail: 'tim@gmail.com',
	OAuthEmailVerified: true,
};

export const mockObjectID = ObjectId.createFromTime(Date.now());

export const mockUserFromDatabase: TDBUser = {
	_id: mockObjectID,
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
	accessLevel: 'demo',
};

export const mockIncomingOAuthUserData: IUserProfileProperties = {
	OAuthProviderName: 'google',
	OAuthProviderID: '123456',
	thumbnailURL: 'https://myphotos@myphotos.com',
	displayName: 'Tim123',
	familyName: 'Roosevelt',
	givenName: 'Tim',
	OAuthEmail: 'tim@gmail.com',
	OAuthEmailVerified: true,
};
