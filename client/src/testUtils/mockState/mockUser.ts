import ObjectId from 'bson-objectid';
import { TUserState } from '../../modules/Auth/state/authStateTypes';

/**
 * Requirements:
 * 1.  All object IDs are converted to string types
 * 2.  every image owner id should be same as user's id
 * 3.  export genuine id that corresponds to those in mock data
 * 4.  export functions to access needed slices of mock data
 * 5.  user-defined breakpoints need genuine, unique IDs
 * 6.  user object should specify some user preferences
 */

const userID = new ObjectId().toHexString();

export const getMockUserID = () => userID;

const mockUser: TUserState = {
	_id: userID,
	OAuthProviderName: 'google',
	OAuthProviderID: '123GoogleID',
	thumbnailURL:
		'https://images.unsplash.com/photo-1472457897821-70d3819a0e24?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80',
	registeredDomains: [],
	displayName: 'userGuy123',
	familyName: 'thompson',
	givenName: 'ted',
	OAuthEmail: 'mail@oauthEmail.com',
	userPreferences: {
		preferredEmail: 'preferred@preferred.net',
		preferredDisplayName: 'Gimblesnort',
	},
	imageCount: 4,
	uploadUsage: 147446,
	accessLevel: 'demo',
	// TODO: not positive this is correct
	createdAt: new ObjectId(userID).getTimestamp().toString(),
};

export default mockUser;
