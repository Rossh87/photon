import { IGoogleOAuthResponse, TOAuthAccessToken } from '../sharedAuthTypes';
import { GOOGLE_PEOPLE_OAUTH_ENDPOINT } from '../../../CONSTANTS';
import axios, { AxiosInstance } from 'axios';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { BaseError, HTTPErrorTypes } from '../../../core/error';

interface IGoogleDataRequestor<A, B, E extends Error = Error> {
    (token: TOAuthAccessToken): (requestLibrary: A) => TE.TaskEither<E, B>;
}

export type TGoogleRequestResult = TE.TaskEither<
    GoogleDataRequestErr,
    IGoogleOAuthResponse
>;

export const googleDataRequestor: IGoogleDataRequestor<
    AxiosInstance,
    IGoogleOAuthResponse,
    GoogleDataRequestErr
> = (token) => (requestLibrary) => {
    const requestUserData = () =>
        requestLibrary.get<IGoogleOAuthResponse>(GOOGLE_PEOPLE_OAUTH_ENDPOINT, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

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
