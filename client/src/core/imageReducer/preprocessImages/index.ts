import {
	IPreprocessDependencies,
	IPreprocessedFile,
	IPreprocessingResult,
} from './imagePreprocessingTypes';
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

export const fileListToNonEmptyArray = (f: FileList) =>
	pipe(Array.from(f), fromArray);

export const foldToResult = NEAmap<
	Either<ImagePreprocessError, IPreprocessedFile>,
	IPreprocessingResult
>((r) =>
	pipe(
		r,
		Efold<ImagePreprocessError, IPreprocessedFile, IPreprocessingResult>(
			(e) => ({ error: e }),
			(image) => ({ imageData: image })
		)
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
