import { IGoogleOAuthResponse } from '../sharedAuthTypes';
import { GOOGLE_PEOPLE_OAUTH_ENDPOINT } from '../../../CONSTANTS';
import axios, { AxiosInstance } from 'axios';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';

export type TGoogleRequestResult = TE.TaskEither<
	GoogleDataRequestErr,
	IGoogleOAuthResponse
>;

export const requestGoogleData = (
	token: string
): ReaderTaskEither<IAsyncDeps, GoogleDataRequestErr, IGoogleOAuthResponse> => (
	asyncDeps
) => {
	const requestUserData = () =>
		asyncDeps.fetcher.get<IGoogleOAuthResponse>(
			GOOGLE_PEOPLE_OAUTH_ENDPOINT,
			{
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}
		);

	return pipe(
		TE.tryCatch(requestUserData, GoogleDataRequestErr.create),
		TE.map((d) => d.data)
	);
};

export class GoogleDataRequestErr extends BaseError {
	public static create(e: any) {
		return new GoogleDataRequestErr(e);
	}

	public constructor(e: any) {
		const devErrMessage =
			"HTTP request for user's profile data from Google rejected";
		super(devErrMessage, HTTPErrorTypes.BAD_GATEWAY, e);
	}
}
