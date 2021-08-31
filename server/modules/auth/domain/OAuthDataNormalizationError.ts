import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { IUserProfileProperties } from '../../../../sharedTypes/User';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import { IGoogleOAuthResponse } from '../sharedAuthTypes';
import { Errors } from 'io-ts';

export class OAuthDataNormalizationError extends BaseError {
	static create(missingOrInvalidProps: Errors, received: unknown) {
		return new OAuthDataNormalizationError(missingOrInvalidProps, received);
	}

	constructor(missingOrInvalidProps: Errors, received: unknown) {
		const errString = missingOrInvalidProps
			.map((err) => err.value)
			.join(', ');
		const devMessage = `OAuth response normalization failed.  The following required properties are missing or invald: ${errString}`;
		super(devMessage, HTTPErrorTypes.BAD_GATEWAY, received);
	}
}
