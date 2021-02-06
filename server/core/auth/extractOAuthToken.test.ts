import extractOAuthToken from './extractOAuthToken';
import Result from 'ts-result';
import { Request } from 'express';
import { GrantResponse } from 'grant';

const mockGrantResponse: GrantResponse = {};

it('returns a Left<AuthError> if required properties are missing from the Request object', () => {
    const mockRequest: Partial<Request> = {
        session: {
            grant: {
                response: {},
            },
        },
    };
});
