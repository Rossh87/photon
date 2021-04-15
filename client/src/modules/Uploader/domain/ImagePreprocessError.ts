import { BaseError } from '../../../core/error';
import { IImage } from './domainTypes';

export class ImagePreprocessError extends BaseError {
	public readonly invalidFile: IImage;

	public static create(message: string, file: IImage) {
		return new ImagePreprocessError(message, file);
	}

	private constructor(message: string, file: IImage) {
		super(message, null);

		this.invalidFile = file;
	}
}
