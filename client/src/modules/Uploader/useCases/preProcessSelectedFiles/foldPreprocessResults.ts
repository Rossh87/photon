import { IImage } from '../../domain/domainTypes';
import { Either, fold as Efold } from 'fp-ts/lib/Either';
import { map as NEAmap } from 'fp-ts/lib/NonEmptyArray';
import { ImagePreprocessError } from '../../domain/ImagePreprocessError';

// TODO: this is MEGA hacky to get the error type and success type to
// converge to the same type.  This is to allow for changes in the IImage
// model that happened after this file was written.  This hack avoids a rewrite
// of all the preceding code.  But it's pretty confusing...
export const foldToResult = NEAmap<
	Either<ImagePreprocessError, IImage>,
	IImage
>(
	Efold(
		(e) => Object.assign(e.invalidFile, { status: 'error', error: e }),
		(image) => Object.assign(image, { status: 'preprocessed' })
	)
);
