import { BaseError } from '../../../../core/error';
import { IPreprocessedFile } from './uploadPreprocessingTypes';

export class UploadPreprocessError extends BaseError {
	public readonly invalidFile?: IPreprocessedFile;

	public static create(message: string, file?: IPreprocessedFile) {
		return new UploadPreprocessError(message, file);
	}

	private constructor(message: string, file?: IPreprocessedFile) {
		super(message, null);

		if (file) {
			this.invalidFile = file;
		}
	}
}
