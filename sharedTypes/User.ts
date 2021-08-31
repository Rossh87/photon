import { ObjectId } from 'mongodb';

export type TOAuthProvider = 'google' | 'github';
export type TAccessLevel = 'demo' | 'admin' | 'full';

export interface IUserServiceUsageProperties {
	registeredDomains: Array<string>;
	imageCount: number;
	uploadUsage: number;
	accessLevel: TAccessLevel;
}

export interface IUserProfileProperties {
	OAuthProviderName: TOAuthProvider;
	OAuthProviderID: string;
	thumbnailURL?: string;
	displayName: string;
	familyName?: string;
	givenName?: string;
	OAuthEmail: string;
	OAuthEmailVerified?: boolean;
	preferredEmail?: string;
	preferredVerified?: boolean;
}

// TUser represents combination of normalized OAuth data and properties
// tracked by our app
export type TUser = IUserProfileProperties & IUserServiceUsageProperties;

// TUser object as recovered from database
export type TDBUser = TUser & { _id: ObjectId };

// type for data shape that will be sent to client on authorization
export type TAuthorizedUserResponse = TUser & { _id: string };
