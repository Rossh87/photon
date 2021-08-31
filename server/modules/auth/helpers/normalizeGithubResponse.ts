import { pipe } from 'fp-ts/lib/function';
import { IUserProfileProperties } from 'sharedTypes/User';
import { GithubOAuthResponse } from '../sharedAuthTypes';
import { OAuthDataNormalizationError } from '../domain/OAuthDataNormalizationError';
import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import * as O from 'fp-ts/Option';

type DecodedGHResponse = t.TypeOf<typeof GithubOAuthResponse>;

const ghResponseToProfileProps = (
	ghr: DecodedGHResponse
): IUserProfileProperties => {
	const names = getNamesFromUsername(ghr.name);

	return {
		OAuthProviderName: 'github' as const,
		OAuthProviderID: ghr.id.toString(),
		thumbnailURL: ghr.avatar_url,
		displayName: ghr.login,
		familyName: names[1],
		givenName: names[0],
		OAuthEmail: ghr.email,
		OAuthEmailVerified: false,
	};
};

const getNamesFromUsername = (username?: string) =>
	pipe(
		username,
		O.fromNullable,
		O.map((name) => name.split(' ')),
		O.map((names) =>
			names.length > 1
				? [names[0], names[names.length - 1]]
				: [...names, '']
		),
		// if we don't have a name property, we define its value as an empty string,
		// ie a 'default' value
		O.getOrElse(() => ['', ''])
	);

export const normalizeGithubResponse = (ghResponse: unknown) =>
	pipe(
		GithubOAuthResponse.decode(ghResponse),
		E.map(ghResponseToProfileProps),
		E.mapLeft((e) => OAuthDataNormalizationError.create(e, ghResponse))
	);
