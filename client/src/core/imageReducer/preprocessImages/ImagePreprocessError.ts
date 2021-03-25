import { BaseError } from '../../error';
import { IPreprocessedFile } from './uploadPreprocessingTypes';

export class ImagePreprocessError extends BaseError {
	public readonly invalidFile?: IPreprocessedFile;

	public static create(message: string, file?: IPreprocessedFile) {
		return new ImagePreprocessError(message, file);
	}

	private constructor(message: string, file?: IPreprocessedFile) {
		super(message, null);

		if (file) {
			this.invalidFile = file;
		}
	}
}
