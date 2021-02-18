import { Either, left, right } from 'fp-ts/lib/Either';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import { Request } from 'express';

type TOAuthAccessToken = string;

interface IAccessTokenExtractor {
    (req: Request): Either<MissingOAuthTokenErr, TOAuthAccessToken>;
}

export class MissingOAuthTokenErr extends BaseError {
    constructor(message: string) {
        super(message, HTTPErrorTypes.UNAUTHORIZED);
    }
}

const err = new MissingOAuthTokenErr(
    'OAuth authorization callback reached, but no access token was present in the response'
);

export const extractOAuthToken: IAccessTokenExtractor = (r) => {
    const token = r.session?.grant?.response?.access_token;

    return token ? right(token) : left(err);
};
