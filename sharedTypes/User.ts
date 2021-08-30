export type TOAuthProvider = 'google';

// type for data shape that will be sent to client on authorization
export interface IAuthorizedUserResponse {
	OAuthProviderName: TOAuthProvider;
	_id: string;
	thumbnailURL: string;
	displayName: string;
	familyName: string;
	givenName: string;
	emailAddress: string;
}
