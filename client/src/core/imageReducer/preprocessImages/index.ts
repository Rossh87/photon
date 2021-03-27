import {
	IPreprocessDependencies,
	IPreprocessedFile,
} from './imagePreprocessingTypes';
import { collatePreprocessResults } from './preprocessFilesConstructs';
import {
	Either,
	map as Emap,
	fromOption,
	right,
	left,
	fold as Efold,
} from 'fp-ts/lib/Either';
import { pipe, flow } from 'fp-ts/lib/function';
import { MAX_RAW_FILE_SIZE_IN_BYTES } from '../../../CONSTANTS';
import {
	NonEmptyArray,
	map as NEAmap,
	fromArray,
} from 'fp-ts/lib/NonEmptyArray';
import { ImagePreprocessError } from './ImagePreprocessError';

export const bytesToHumanReadableSize = (byteCount: number): string =>
	byteCount < 1024
		? byteCount + 'bytes'
		: byteCount >= 1024 && byteCount < 1048576
		? (byteCount / 1024).toFixed(1) + 'KB'
		: (byteCount / 1048576).toFixed(1) + 'MB';

export const generateFileSizeErr = (
	file: IPreprocessedFile
): ImagePreprocessError => {
	const message = `file ${file.name} exceeds maximum initial image size of ${
		MAX_RAW_FILE_SIZE_IN_BYTES / 1000 / 1000
	}MB`;

	return ImagePreprocessError.create(message, file);
};

const validateFileSize = (
	file: IPreprocessedFile
): Either<ImagePreprocessError, IPreprocessedFile> =>
	file.size <= MAX_RAW_FILE_SIZE_IN_BYTES
		? right(file)
		: left(generateFileSizeErr(file));

const appendMetadataToFile = (deps: IPreprocessDependencies) => (file: File) =>
	Object.assign<
		File,
		Pick<
			IPreprocessedFile,
			| 'ownerID'
			| 'humanReadableSize'
			| 'displayName'
			| 'originalSizeInBytes'
		>
	>(file, {
		ownerID: deps.ownerID,
		humanReadableSize: bytesToHumanReadableSize(file.size),
		displayName: file.name,
		originalSizeInBytes: file.size,
	});

// We return a strange type here to make this result compatible with collation
// function
export const generateEmptyFileListErr = (): NonEmptyArray<
	Either<ImagePreprocessError, never>
> => [left(ImagePreprocessError.create('at least one file must be selected'))];

export const fileListToNonEmptyArray = (
	f: FileList
): Either<
	NonEmptyArray<Either<ImagePreprocessError, never>>,
	NonEmptyArray<File>
> =>
	pipe(
		Array.from(f),
		fromArray,
		fromOption(() => generateEmptyFileListErr())
	);

export const processAndValidateFiles = (deps: IPreprocessDependencies) =>
	pipe(flow(appendMetadataToFile(deps), validateFileSize), NEAmap);

export const preprocessImages = (deps: IPreprocessDependencies) =>
	flow(
		fileListToNonEmptyArray,
		// if array is empty we'll have a result to collate at this point, so go ahead
		// and fold our Either type.
		Efold(collatePreprocessResults, (files) =>
			pipe(files, processAndValidateFiles(deps), collatePreprocessResults)
		)
	);
