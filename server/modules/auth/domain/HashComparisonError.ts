import { BaseError, HTTPErrorTypes } from '../../../core/error';

export class HashComparisonError extends BaseError {
	public static create(email: string, raw: any) {
		const devMessage = `attempt to compare hashes for ${email} failed for following reason: ${raw}`;
		return new HashComparisonError(devMessage, raw);
	}

	private constructor(devMessage: string, e: any) {
		super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, e);
	}
}
