import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { IUserProfileProperties } from '../../../../sharedTypes/User';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import { IGoogleOAuthResponse } from '../sharedAuthTypes';

export class OAuthDataNormalizationError extends BaseError {
	static create(
		missingOrInvalidProps: NonEmptyArray<string>,
		received: Record<string, any>
	) {
		return new OAuthDataNormalizationError(missingOrInvalidProps, received);
	}

	constructor(
		missingOrInvalidProps: NonEmptyArray<string>,
		received: Record<string, any>
	) {
		const errString = missingOrInvalidProps.join(', ');
		const devMessage = `OAuth response normalization failed.  The following required properties are missing or invald: ${errString}`;
		super(devMessage, HTTPErrorTypes.BAD_GATEWAY, received);
	}
}
