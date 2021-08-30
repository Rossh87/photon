export interface IAuthorizedUserResponse {
	OAuthProviderName: string;
	_id: string;
	thumbnailURL: string;
	displayName: string;
	familyName: string;
	givenName: string;
	emailAddress: string;
}

export type TUserState = IAuthorizedUserResponse | null;
