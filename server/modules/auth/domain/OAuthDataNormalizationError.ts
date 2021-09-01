import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { IUserProfileProperties } from '../../../../sharedTypes/User';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import { IGoogleOAuthResponse } from '../sharedAuthTypes';
import { Errors, Validation } from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';

export class OAuthDataNormalizationError extends BaseError {
	missingOrInvalidProps: string[];

	static create(rawMissingOrInvalidProps: Errors, received: unknown) {
		return new OAuthDataNormalizationError(
			rawMissingOrInvalidProps,
			received
		);
	}

	constructor(missingOrInvalidProps: Errors, received: unknown) {
		const errString = missingOrInvalidProps
			.map((err) => err.message)
			.join(', ');
		const devMessage = `OAuth response normalization failed.  The following required properties are missing or invalid: ${errString}`;
		super(devMessage, HTTPErrorTypes.BAD_GATEWAY, received);
		this.missingOrInvalidProps = formatValidationErrors(
			missingOrInvalidProps
		);
	}
}
