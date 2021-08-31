import { IGoogleOAuthResponse } from '../sharedAuthTypes';
import { GOOGLE_PEOPLE_OAUTH_ENDPOINT } from '../../../CONSTANTS';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';
import { OAuthDataRequestError } from '../domain/OAuthDataRequestError';
import { IOAuthCallbackConfig } from '../controllers/oAuthCallbackConfigs';

export type TGoogleRequestResult = TE.TaskEither<
	OAuthDataRequestError,
	IGoogleOAuthResponse
>;

export const requestOAuthData =
	(config: IOAuthCallbackConfig) =>
	(
		token: string
	): ReaderTaskEither<IAsyncDeps, OAuthDataRequestError, unknown> =>
	(asyncDeps) => {
		const requestUserData = () =>
			asyncDeps.fetcher.get(config.tokenExchangeEndpoint, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			});

		return pipe(
			TE.tryCatch(requestUserData, (e) =>
				OAuthDataRequestError.create(config.OAuthProviderName, e)
			),
			TE.map((d) => d.data)
		);
	};
