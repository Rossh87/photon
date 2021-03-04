import { filter, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { UploadError } from './UploadError';
import { flow } from 'fp-ts/lib/function';
import { getOrElse } from 'fp-ts/lib/Option';
import {
	TFileActions,
	IImageUploadState,
	TPreprocessedFiles,
	TPreprocessErrors,
	IProcessedFile,
} from './uploadTypes';

export const makeFileNameFilter = (nameForRemoval: string) =>
	filter((file: IProcessedFile) => file.displayName !== nameForRemoval);

export const makeErrorNameFilter = (nameForRemoval: string) =>
	filter(
		(err: UploadError) => err.invalidFile?.displayName !== nameForRemoval
	);

export const filterOneError = (nameForRemoval: string) =>
	flow(
		makeErrorNameFilter(nameForRemoval),
		getOrElse<TPreprocessErrors | []>(() => [])
	);

export const filterOneFile = (nameForRemoval: string) =>
	flow(
		makeFileNameFilter(nameForRemoval),
		getOrElse<TPreprocessedFiles | []>(() => [])
	);
