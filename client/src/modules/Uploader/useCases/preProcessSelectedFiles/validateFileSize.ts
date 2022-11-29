import { IImage, IImageWithErrors } from '../../domain/domainTypes';
import { Either, left, right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { MAX_RAW_FILE_SIZE_IN_BYTES } from '../../../../CONSTANTS';
import { ImagePreprocessError } from '../../domain/ImagePreprocessError';

const generateFileSizeErr = (file: IImage): ImagePreprocessError => {
	const message = `file ${file.name} exceeds maximum initial image size of ${
		MAX_RAW_FILE_SIZE_IN_BYTES / 1000 / 1000
	}MB`;

	return ImagePreprocessError.create(message, file);
};

const makeImageWithFileSizeErr = (image: IImage): IImageWithErrors =>
	Object.assign(image, {
		error: pipe(image, generateFileSizeErr),
		status: 'error' as const,
	});

// As of now, we fold this either right away.  However,
// we'll leave it in to facilitate further local validation in the future,
// i.e. either-mapping.
export const validateFileSize = (
	file: IImage
): Either<IImageWithErrors, IImage> =>
	file.size <= MAX_RAW_FILE_SIZE_IN_BYTES
		? pipe(file, right)
		: pipe(file, makeImageWithFileSizeErr, left);
