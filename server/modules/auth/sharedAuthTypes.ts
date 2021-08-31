import { AxiosInstance } from 'axios';
import { Either } from 'fp-ts/lib/Either';

// Begin Google OAuth flow types
export type TOAuthAccessToken = string;

export type TOAuthDataResponse = IGoogleOAuthResponse;

export type TGoogleOAuthSubData =
	| IGoogleEmailsObject
	| IGoogleMetadataObject
	| IGoogleNamesObject
	| IGooglePhotosObject;

export interface IGoogleOAuthResponse {
	resourceName: string;
	etag: string;
	names: Array<IGoogleNamesObject>;
	emailAddresses: Array<IGoogleEmailsObject>;
	photos: Array<IGooglePhotosObject>;
}

export interface IGoogleNamesObject {
	metadata: IGoogleMetadataObject;
	displayName: string;
	familyName: string;
	givenName: string;
	displayNameLastFirst: string;
	unstructuredName: string;
}
export interface IGoogleEmailsObject {
	metadata: IGoogleMetadataObject;
	value: string;
}

export interface IGooglePhotosObject {
	url: string;
	metadata: IGoogleMetadataObject;
	primary: true;
}
export interface IGoogleMetadataObject {
	primary: boolean;
	verified?: boolean;
	source: {
		type: string;
		id: string;
	};
}

// Begin Github OAuth flow types
// with token scope "read:user"
export interface IGithubOAuthResponse {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
	name: string;
	company: null;
	blog: string;
	location: string;
	email: string;
	hireable: null;
	bio: string;
	twitter_username: null;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
	private_gists: number;
	total_private_repos: number;
	owned_private_repos: number;
	disk_usage: number;
	collaborators: number;
	two_factor_authentication: boolean;
	plan: {
		name: string;
		space: number;
		collaborators: number;
		private_repos: number;
	};
}

// we export this type as a partial because we can't count on anything
// being present--need to verify it all.
export type TParseableGHOAuthResponse = Partial<IGithubOAuthResponse>;

// Begin function types
export interface IRequestLibrary extends AxiosInstance {}
