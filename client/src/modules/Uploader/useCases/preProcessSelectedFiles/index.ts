import { IPreprocessDependencies, IImage } from '../../domain/domainTypes';
import {
	Either,
	map as Emap,
	mapLeft as EMapLeft,
	right,
	left,
	fold as Efold,
} from 'fp-ts/lib/Either';
import { map as OMap } from 'fp-ts/lib/Option';
import { pipe, flow } from 'fp-ts/lib/function';
import { MAX_RAW_FILE_SIZE_IN_BYTES } from '../../../../CONSTANTS';
import {
	NonEmptyArray,
	map as NEAmap,
	fromArray,
} from 'fp-ts/lib/NonEmptyArray';
import { ImagePreprocessError } from '../../domain/ImagePreprocessError';

export const bytesToHumanReadableSize = (byteCount: number): string =>
	byteCount < 1024
		? byteCount + 'bytes'
		: byteCount >= 1024 && byteCount < 1048576
		? (byteCount / 1024).toFixed(1) + 'KB'
		: (byteCount / 1048576).toFixed(1) + 'MB';

export const generateFileSizeErr = (file: IImage): ImagePreprocessError => {
	const message = `file ${file.name} exceeds maximum initial image size of ${
		MAX_RAW_FILE_SIZE_IN_BYTES / 1000 / 1000
	}MB`;

	return ImagePreprocessError.create(message, file);
};

const validateFileSize = (file: IImage): Either<ImagePreprocessError, IImage> =>
	file.size <= MAX_RAW_FILE_SIZE_IN_BYTES
		? right(file)
		: left(generateFileSizeErr(file));

const appendMetadataToFile = (deps: IPreprocessDependencies) => (file: File) =>
	Object.assign<
		File,
		Pick<
			IImage,
			| 'ownerID'
			| 'humanReadableSize'
			| 'displayName'
			| 'originalSizeInBytes'
			| 'status'
		>
	>(file, {
		ownerID: deps.ownerID,
		humanReadableSize: bytesToHumanReadableSize(file.size),
		displayName: file.name,
		originalSizeInBytes: file.size,
		status: 'preprocessed',
	});

export const fileListToNonEmptyArray = (f: FileList) =>
	pipe(Array.from(f), fromArray);

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

export const processAndValidateFiles = (deps: IPreprocessDependencies) =>
	pipe(flow(appendMetadataToFile(deps), validateFileSize), NEAmap);

export const preprocessImages = (deps: IPreprocessDependencies) =>
	flow(
		fileListToNonEmptyArray,
		OMap(processAndValidateFiles(deps)),
		OMap(foldToResult)
	);
