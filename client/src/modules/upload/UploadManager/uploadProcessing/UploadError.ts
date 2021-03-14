import { BaseError } from '../../../../core/error';
import { IResizingMetadata } from './uploadProcessingTypes';

// If upload fails due to server error/network failure, we attach
// the resized images to the emitted error, so we can re-use them on retry,
// as it's the most computationally expensive piece of this process
export class UploadError extends BaseError {
	public static create(
		message: string,
		e: any,
		resizingData?: IResizingMetadata
	) {
		return new UploadError(message, e, resizingData);
	}

	private constructor(
		m: string,
		raw: any,
		public readonly resizingData?: IResizingMetadata
	) {
		super(m, raw);
	}
}
