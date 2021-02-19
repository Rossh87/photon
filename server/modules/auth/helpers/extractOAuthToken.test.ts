import { extractOAuthToken, MissingOAuthTokenErr } from './extractOAuthToken';
import { Request } from 'express';
import { Either, mapLeft, map } from 'fp-ts/lib/Either';

const genMockRequest = (token?: string) => ({
    session: {
        grant: {
            response: {
                access_token: token,
            },
        },
    },
});

it('returns appropriate error if required properties are missing from the Request object', () => {
    const mockRequest1 = genMockRequest() as Request;
    const mockRequest2 = { session: {} } as Request;

    const res1 = extractOAuthToken(mockRequest1);
    const test1 = mapLeft<MissingOAuthTokenErr, void>((e) =>
        expect(e.HTTPErrorType.status).toBe(401)
    );
    test1(res1);

    const res2 = extractOAuthToken(mockRequest2);
    const test2 = mapLeft<MissingOAuthTokenErr, void>((e) =>
        expect(e.HTTPErrorType.status).toBe(401)
    );
    test2(res2);
});

it('returns a Right<Token> if required properties are present on the Request object', () => {
    const token = '12345';
    const mockRequest = genMockRequest(token) as Request;
    const result = extractOAuthToken(mockRequest);
    const test1 = map<string, void>((t) => expect(t).toEqual('12345'));
    test1(result);
});
