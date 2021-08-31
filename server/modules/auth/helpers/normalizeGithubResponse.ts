import { flow, pipe } from 'fp-ts/lib/function';
import { IUserProfileProperties } from 'sharedTypes/User';
import {
	IGithubOAuthResponse,
	TParseableGHOAuthResponse,
} from '../sharedAuthTypes';
import { right, left } from 'fp-ts/Either';
import { OAuthDataNormalizationError } from '../domain/OAuthDataNormalizationError';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { verifyOAuthFields } from './verifyOAuthFields';

const getNamesFromUsername = (username?: string) =>
	username
		? pipe(username.split(' '), (names) =>
				names.length > 1
					? [names[0], names[names.length - 1]]
					: [...names, '']
		  )
		: [undefined, undefined];

export const normalizeGithubOAuthProps = (
	ghResponse: TParseableGHOAuthResponse
) => {
	const names = getNamesFromUsername(ghResponse && ghResponse.name);

	const OAuthProviderName = 'github' as const;
	const OAuthProviderID = ghResponse.id?.toString();
	const thumbnailURL = ghResponse.avatar_url;
	const displayName = ghResponse.login;
	const familyName = names[1];
	const givenName = names[0];
	const OAuthEmail = ghResponse.email;
	const OAuthEmailVerified = false;

	const profileProps = {
		OAuthProviderName,
		OAuthProviderID,
		thumbnailURL,
		displayName,
		familyName,
		givenName,
		OAuthEmail,
		OAuthEmailVerified,
	};

	return profileProps;
};

export const normalizeGithubResponse = flow(
	normalizeGithubOAuthProps,
	verifyOAuthFields
);
