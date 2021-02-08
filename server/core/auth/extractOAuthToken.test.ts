import { extractToken } from './extractOAuthToken';
import { Request } from 'express';
import { GrantResponse } from 'grant';
import { Result } from 'ts-result';

const genMockRequest = (token?: string) => ({
    session: {
        grant: {
            response: {
                access_token: token,
            },
        },
    },
});

it('returns a Left<AuthError> if required properties are missing from the Request object', () => {
    const mockRequest1 = genMockRequest() as Request;
    const mockRequest2 = { session: {} } as Request;

    const res1 = extractToken(mockRequest1);
    expect(Result.ok(res1)).toBe(false);
    expect(res1.fold()).toEqual(
        new Error('grant: field "accessToken" unpopulated in auth callback')
    );

    const res2 = extractToken(mockRequest2);
    expect(Result.ok(res2)).toBe(false);
    expect(res2.fold()).toEqual(
        new Error('grant: field "accessToken" unpopulated in auth callback')
    );
});

it('returns a Right<Token> if required properties are present on the Request object', () => {
    const token = '12345';
    const mockRequest = genMockRequest(token) as Request;
    const result = extractToken(mockRequest);
    expect(Result.ok(result)).toBe(true);
    expect(result.fold()).toEqual(token);
});
