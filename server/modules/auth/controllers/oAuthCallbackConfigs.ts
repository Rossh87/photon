import {
    IUserProfileProperties,
    TIdentityProvider,
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
    identityProvider: TIdentityProvider;
    normalizer: (
        a: unknown
    ) => E.Either<OAuthDataNormalizationError, IUserProfileProperties>;
    tokenExchangeEndpoint: string;
}

export const oAuthCallbackConfigs: Record<
    Exclude<TIdentityProvider, 'local'>,
    IOAuthCallbackConfig
> = {
    github: {
        identityProvider: 'github',
        normalizer: normalizeGithubResponse,
        tokenExchangeEndpoint: GITHUB_USER_OAUTH_ENDPOINT,
    },
    google: {
        identityProvider: 'google',
        normalizer: normalizeGoogleResponse,
        tokenExchangeEndpoint: GOOGLE_PEOPLE_OAUTH_ENDPOINT,
    },
};
