import {
	mockGoogleOAuthResponse,
	mockUserFromGoogleResponse,
} from './mockData';
import { normalizeGoogleResponse } from './normalizeGoogleResponse';
import { OAuthDataNormalizationError } from '../domain/OAuthDataNormalizationError';
import { IGoogleOAuthResponse } from '../sharedAuthTypes';
import * as E from 'fp-ts/lib/Either';

let mockData = Object.assign<{}, IGoogleOAuthResponse>(
	{},
	mockGoogleOAuthResponse
);

// cleanup any changes our individual tests make to the mock data object
beforeEach(() => (mockData = Object.assign({}, mockGoogleOAuthResponse)));

describe('Google OAuth response normalizer', () => {
	it('returns a correctly populated instance of User data', () => {
		const received = normalizeGoogleResponse(mockData);
		expect(received).toEqual(E.right(mockUserFromGoogleResponse));
	});

	it('returns an error that lists missing fields if response is incomplete', () => {
		Object.defineProperty(mockData, 'resourceName', {
			value: null,
		});

		const expectedErr = OAuthDataNormalizationError.create(
			['OAuthProviderID'],
			mockData
		);

		const received = normalizeGoogleResponse(mockData);

		expect(received).toEqual(E.left(expectedErr));
	});
});
