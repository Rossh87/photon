import {
	IUserProfileProperties,
	TOAuthProvider,
} from '../../../../sharedTypes/User';
import * as E from 'fp-ts/Either';
import { OAuthDataNormalizationError } from '../domain/OAuthDataNormalizationError';
import { normalizeGithubResponse } from '../helpers/normalizeGithubResponse';
import {
	GITHUB_USER_OAUTH_ENDPOINT,
	GOOGLE_PEOPLE_OAUTH_ENDPOINT,
} from '../../../CONSTANTS';
import { normalizeGoogleResponse } from '../helpers/normalizeGoogleResponse';

export interface IOAuthCallbackConfig {
	OAuthProviderName: TOAuthProvider;
	normalizer: (
		a: any
	) => E.Either<OAuthDataNormalizationError, IUserProfileProperties>;
	tokenExchangeEndpoint: string;
}

export const oAuthCallbackConfigs: Record<
	TOAuthProvider,
	IOAuthCallbackConfig
> = {
	github: {
		OAuthProviderName: 'github',
		normalizer: normalizeGithubResponse,
		tokenExchangeEndpoint: GITHUB_USER_OAUTH_ENDPOINT,
	},
	google: {
		OAuthProviderName: 'google',
		normalizer: normalizeGoogleResponse,
		tokenExchangeEndpoint: GOOGLE_PEOPLE_OAUTH_ENDPOINT,
	},
};
