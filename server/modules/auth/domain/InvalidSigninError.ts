import { BaseError, HTTPErrorTypes } from '../../../core/error';

export type SigninInvalidReason = 'Too many attempts' | 'Invalid credentials';

export class InvalidSignInError extends BaseError {
	public static create(devMessage: string, reason: SigninInvalidReason) {
		return new InvalidSignInError(devMessage, reason);
	}

	private constructor(
		devMessage: string,
		public readonly reason: SigninInvalidReason
	) {
		super(devMessage, HTTPErrorTypes.UNAUTHORIZED, null, reason);
	}
}
