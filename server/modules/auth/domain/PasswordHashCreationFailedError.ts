import { TIdentityProvider } from '../../../../sharedTypes/User';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import {
	LocalUserCredentials,
	TLocalUserCredentials,
} from '../sharedAuthTypes';

export type SignupInvalidReason = 'emailInuse' | 'passwordInvalid';

export class PasswordHashCreationFailedError extends BaseError {
	public static create(raw: any) {
		const devMessage = `Attempt to hash password at new user signupt failed for the following reason: ${raw}`;
		return new PasswordHashCreationFailedError(devMessage, raw);
	}

	private constructor(devMessage: string, e: any) {
		super(devMessage, HTTPErrorTypes.FORBIDDEN, e);
	}
}
