import {
	TPreprocessArgs,
	IImage,
	TNonEmptyPreprocessArgs,
} from '../../domain/domainTypes';
import {
	Either,
	map as Emap,
	mapLeft as EMapLeft,
	right,
	left,
	fold as Efold,
} from 'fp-ts/lib/Either';
import { map as OMap, Option } from 'fp-ts/lib/Option';
import { pipe, flow } from 'fp-ts/lib/function';
import { MAX_RAW_FILE_SIZE_IN_BYTES } from '../../../../CONSTANTS';
import {
	NonEmptyArray,
	map as NEAmap,
	fromArray as NEAFromArray,
} from 'fp-ts/lib/NonEmptyArray';
import { ImagePreprocessError } from '../../domain/ImagePreprocessError';
import { TUploaderActions } from '../../state/uploadStateTypes';
import { Dispatch } from 'react';
import { IO } from 'fp-ts/lib/IO';

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

const appendMetadataToFile = (ownerID: string) => (file: File) =>
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
		ownerID: ownerID,
		humanReadableSize: bytesToHumanReadableSize(file.size),
		displayName: file.name,
		originalSizeInBytes: file.size,
		status: 'preprocessed',
	});

export const fileListToNonEmptyArray = ([
	fileList,
	ownerID,
]: TPreprocessArgs): Option<TNonEmptyPreprocessArgs> =>
	pipe(
		fileList,
		(list) => Array.from<File>(list),
		NEAFromArray,
		OMap((files) => [files, ownerID])
	);

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

const preprocessOneFile = (ownerID: string) =>
	flow(appendMetadataToFile(ownerID), validateFileSize);

export const processAndValidateFiles = ([
	files,
	ownerID,
]: TNonEmptyPreprocessArgs) => pipe(files, NEAmap(preprocessOneFile(ownerID)));

export const preprocessImages =
	(fileData: TPreprocessArgs) =>
	(dispatch: Dispatch<TUploaderActions>): IO<void> =>
	() =>
		pipe(
			fileData,
			fileListToNonEmptyArray,
			OMap(processAndValidateFiles),
			OMap(foldToResult),
			OMap((preprocessedFiles) =>
				dispatch({ type: 'FILES_SELECTED', payload: preprocessedFiles })
			)
		);
