import {
    mockGoogleOAuthResponse,
    mockUserFromGoogleResponse,
} from './mockData';
import { normalizeGoogleResponse } from './normalizeGoogleResponse';

let mockData = mockGoogleOAuthResponse;

// cleanup any changes our individual tests make to the mock data object
afterEach(() => (mockData = Object.assign({}, mockGoogleOAuthResponse)));

describe('Google OAuth response normalizer', () => {
    it('returns a correctly populated instance of User data', () => {
        const received = normalizeGoogleResponse(mockData);
        expect(received).toEqual(mockUserFromGoogleResponse);
    });
});
