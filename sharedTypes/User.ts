import { ObjectId } from 'mongodb';

export type TOAuthProvider = 'google' | 'github';
export type TAccessLevel = 'demo' | 'admin' | 'full';

export interface IUserServiceUsageProperties {
	registeredDomains: Array<string>;
	imageCount: number;
	uploadUsage: number;
	accessLevel: TAccessLevel;
}

export interface IUserProfilePreferences {
	preferredEmail?: string;
	preferredThumbnailURL?: string;
	preferredDisplayName?: string;
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
	userPreferences?: IUserProfilePreferences;
}

// TUser represents combination of normalized OAuth data and properties
// tracked by our app
export type TUser = IUserProfileProperties & IUserServiceUsageProperties;

// TUser object as recovered from database
export type TDBUser = TUser & { _id: ObjectId };

// id is automatically serialized by express-session
export type TSessionUser = TUser & { _id: string };

// type for data shape that will be sent to client on authorization
export type TAuthorizedUserResponse = TSessionUser & { createdAt: string };

// extract this to its own type just for clarity in naming
export interface IUserProfilePreferencesTransportObject
	extends IUserProfilePreferences {}

export type TProfilePreferenceError = string;

// Prevent object from being empty, since if we're responding
// with an error code, we expect there to be an error.
// taken from https://stackoverflow.com/questions/66300983/typescript-partial-but-not-the-full-object-itself
type AtLeastOne<T> = {
	[P in keyof T]: {
		[K in Exclude<keyof T, P>]?: T[P];
	} &
		{ [M in P]: T[M] };
}[keyof T];

// notice we require all properties to be present on
// this intermediate type
type _TProfileErrorsTransportObject = {
	[K in keyof IUserProfilePreferences]-?: TProfilePreferenceError;
};

export type TProfileErrorsTransportObject =
	AtLeastOne<_TProfileErrorsTransportObject>;
