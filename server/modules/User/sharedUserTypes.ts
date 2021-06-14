import { ObjectId } from 'mongodb';

type TOAuthProvider = 'google';

export interface IUser extends Record<string, any> {
	OAuthProviderName: TOAuthProvider;
	OAuthProviderID: string;
	thumbnailURL: string;
	displayName: string;
	familyName: string;
	givenName: string;
	OAuthEmail: string;
	OAuthEmailVerified: boolean;
	preferredEmail?: string;
	preferredVerified?: boolean;
}

// type of User docs retrieved from database
export interface IDBUser extends IUser {
	_id: ObjectId;
	registeredDomains: Array<string>;
	imageCount: number;
	uploadUsage: number;
}

// type for data shape that will be sent to client on authorization
export interface IAuthorizedUserResponse extends Record<string, any> {
	OAuthProviderName: TOAuthProvider;
	_id: string;
	thumbnailURL: string;
	displayName: string;
	familyName: string;
	givenName: string;
	emailAddress: string;
}
