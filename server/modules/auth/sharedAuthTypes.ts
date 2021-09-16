import { AxiosInstance } from 'axios';
import { flow, pipe } from 'fp-ts/lib/function';
import { chain, fold, fromPredicate } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import { withMessage } from 'io-ts-types';
import { IUserProfileProperties } from '../../../sharedTypes/User';
import { EmailAddress } from '../User/helpers/parseUserPreferences';
import * as A from 'fp-ts/Array';
import * as B from 'fp-ts/boolean';
import { ap } from 'fp-ts/lib/Identity';

const MetadataSourceObject = t.type({
	type: t.string,
	id: t.string,
});

export const GoogleMetadataObject = t.intersection([
	t.type({
		primary: t.boolean,
		source: MetadataSourceObject,
	}),
	t.partial({
		verified: t.boolean,
	}),
]);

export const GooglePhotosObject = t.type({
	url: t.string,
	metadata: GoogleMetadataObject,
});

export const GooglePhotosObjects = t.array(GooglePhotosObject);

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

export const GoogleNamesObject = t.intersection([
	t.type({
		metadata: GoogleMetadataObject,
		displayName: t.string,
	}),
	t.partial({
		familyName: t.string,
		givenName: t.string,
		displayNameLastFirst: t.string,
		unstructuredName: t.string,
	}),
]);

export const GoogleNamesObjects = t.array(GoogleNamesObject);

export interface IGoogleEmailsObject {
	metadata: IGoogleMetadataObject;
	value: string;
}

export const GoogleEmailObject = t.type({
	metadata: GoogleMetadataObject,
	value: t.string,
});

export const GoogleEmailObjects = t.array(GoogleEmailObject);

export interface IGooglePhotosObject {
	url: string;
	metadata: IGoogleMetadataObject;
	primary: boolean;
}

export interface IGoogleMetadataObject {
	primary: boolean;
	verified?: boolean;
	source: {
		type: string;
		id: string;
	};
}

const GoogleOAuthRequiredProps = t.type({
	emailAddresses: GoogleEmailObjects,
	names: GoogleNamesObjects,
	resourceName: t.string,
});

const GoogleOAuthOptionalProps = t.partial({
	photos: GooglePhotosObjects,
});

export const GoogleOAuthResponse = t.intersection([
	GoogleOAuthRequiredProps,
	GoogleOAuthOptionalProps,
]);

// Begin Github OAuth flow types
// with token scope "read:user"
const GithubOAuthRequiredProps = t.type({
	email: t.string,
	login: t.string,
	id: t.number,
});

const GithubOAuthOptionalProps = t.partial({
	avatar_url: t.string,
	name: t.string,
});

export const GithubOAuthResponse = t.intersection([
	GithubOAuthOptionalProps,
	GithubOAuthRequiredProps,
]);

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

/**
 * 8-20 chars
 * at least one special char: !@#$&*
 * at least 1 number
 * at least one lowerCase
 * at least one upperCase
 */

interface PasswordBrand {
	readonly Password: unique symbol;
}

const checkLength = fromPredicate(
	(s: string) => s.length <= 20 && s.length >= 8
);

const checkForUpper = fromPredicate((s: string) => /[A-Z]+/.test(s));

const checkForLower = fromPredicate((s: string) => /[a-z]+/.test(s));

const checkForSpecial = fromPredicate((s: string) => /[!@#$&*]+/.test(s));

const validatePassword = flow(
	checkLength,
	chain(checkForUpper),
	chain(checkForLower),
	chain(checkForSpecial),
	fold(
		() => false,
		() => true
	)
);

export const Password = withMessage(
	t.brand(
		t.string,
		(s: string): s is t.Branded<string, PasswordBrand> =>
			validatePassword(s),
		'Password'
	),
	(e) =>
		'password: Password must be 8-20 chars and contain at least one of each of the following: uppercase letters, lowercase letters, and !,@,#,$,&, or *'
);

export type TPassword = t.TypeOf<typeof Password>;

export const _localUserCredentials = t.type({
	registeredEmailAddress: EmailAddress,
	password: Password,
});

export const LocalUserCredentials = t.exact(_localUserCredentials);

export type TLocalUserCredentials = t.TypeOf<typeof LocalUserCredentials>;

// Begin function types
export interface IRequestLibrary extends AxiosInstance {}
