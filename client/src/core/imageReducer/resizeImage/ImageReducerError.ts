import { BaseError } from '../../error';

// TODO: this needs work to be able to accept all the different ways image reducer can fail
// and still consistently produce intelligible error content
export class ImageReducerError extends BaseError {
	public static create(file: any, e: any, devMessage: string) {
		const publicMessage = `Image reduction failed for file ${file.displayName}`;
		return new ImageReducerError(publicMessage, e, file, devMessage);
	}

	constructor(
		message: string,
		raw: any,
		public readonly failedFile: any,
		public readonly devMessage: string
	) {
		super(message, raw);
		this.failedFile = failedFile;
	}
}
