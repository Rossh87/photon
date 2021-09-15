import { pipe } from 'fp-ts/lib/function';
import { Errors } from 'io-ts';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import * as Bool from 'fp-ts/boolean';
import { isErrors } from './guards';

export type SignupInvalidReason =
	| 'Email already in use'
	| 'Email or password invalid';

const formatErrs = (errs: Errors) => errs.map((err) => err.message).join(', ');

// If we have error data from IO-ts validation, use that to make
// Message.  Otherwise, use whatever is passed-in at err creation
export class InvalidSignupError extends BaseError {
	public static create(
		devMessage: string,
		reason: SignupInvalidReason,
		raw: any | Errors
	) {
		const message = pipe(
			raw,
			isErrors,
			Bool.fold(
				() => devMessage,
				() => formatErrs(raw)
			)
		);

		return new InvalidSignupError(message, reason, raw);
	}

	private constructor(
		devMessage: string,
		public readonly reason: SignupInvalidReason,
		e: any
	) {
		super(devMessage, HTTPErrorTypes.FORBIDDEN, e, reason);
	}
}
