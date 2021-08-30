import { ObjectId } from 'mongodb';
import {
	IAuthorizedUserResponse,
	TOAuthProvider,
	TAccessLevel,
} from 'sharedTypes/User';

export interface IUser
	extends Omit<IAuthorizedUserResponse, '_id' | 'accessLevel'> {
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
	accessLevel: TAccessLevel;
}
