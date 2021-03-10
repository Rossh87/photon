import { BaseError } from '../../../core/error';
import { IPreprocessedFile } from './uploadTypes';

export class UploadError extends BaseError {
	public readonly invalidFile?: IPreprocessedFile;

	public static create(message: string, file?: IPreprocessedFile) {
		return new UploadError(message, file);
	}

	private constructor(message: string, file?: IPreprocessedFile) {
		super(message, null);

		if (file) {
			this.invalidFile = file;
		}
	}
}
