import {
	IImage,
	IImageWithErrors,
	TAllUploadedImages,
} from '../domain/domainTypes';
import { pipe, flow } from 'fp-ts/lib/function';
import {
	NonEmptyArray,
	map as NEAmap,
	fromArray,
} from 'fp-ts/lib/NonEmptyArray';
import { TUploaderActions } from '../state/uploadStateTypes';

import { tryCatch, of as TEOf } from 'fp-ts/TaskEither';
import {
	IDependencies,
	IHttpCall,
	extractResponseData,
} from '../../../core/dependencyContext';
import {
	TDedupeNamesPayload,
	TDedupeNamesResponse,
} from 'server/modules/Upload/sharedUploadTypes';
import { DEDUPLICATION_ENDPOINT } from './endpoints';
import { BaseError } from '../../../core/error';
import { fold } from 'fp-ts/lib/Option';
import { isLeft, Either } from 'fp-ts/lib/Either';

const displayNameFromEither = (e: Either<IImageWithErrors, IImage>) =>
	isLeft(e) ? e.left.displayName : e.right.displayName;

const toPayload: (as: TAllUploadedImages) => TDedupeNamesPayload = flow(
	NEAmap(displayNameFromEither),
	(displayNames) => ({ displayNames })
);

const requestDupes =
	(potentialDupes: TDedupeNamesPayload): IHttpCall<TDedupeNamesResponse> =>
	(httpLib) =>
		httpLib.post(DEDUPLICATION_ENDPOINT, potentialDupes);

// this optimistically extracts displayName and checks for its uniqueness, even
// if the image file in question has errs
export const getDupeDisplayNames =
	(imageFiles: TAllUploadedImages) =>
	(deps: IDependencies<TUploaderActions>) =>
		pipe(
			imageFiles,
			fromArray,
			fold(
				() => TEOf([]),
				(files) =>
					tryCatch(
						() =>
							pipe(
								pipe(files, toPayload, requestDupes),
								deps.http,
								extractResponseData
							),
						(e) =>
							new BaseError(
								'Attempt to request duplicate displayNames from server failed.',
								e
							)
					)
			)
		);
