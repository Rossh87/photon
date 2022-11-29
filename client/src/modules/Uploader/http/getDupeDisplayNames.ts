import {
	IImage,
	IImageWithErrors,
	TAllUploadedImages,
} from '../domain/domainTypes';
import { flow, pipe } from 'fp-ts/lib/function';
import { map as NEAmap } from 'fp-ts/lib/NonEmptyArray';

import { tryCatch } from 'fp-ts/TaskEither';
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
import { Either, isLeft } from 'fp-ts/lib/Either';
import { TAppAction } from '../../appState/appStateTypes';

const displayNameFromEither = (e: Either<IImageWithErrors, IImage>) =>
	isLeft(e) ? e.left.displayName : e.right.displayName;

const toPayload: (as: TAllUploadedImages) => TDedupeNamesPayload = flow(
	NEAmap(displayNameFromEither),
	(displayNames) => ({ displayNames })
);

const requestDupes =
	(potentialDupes: TDedupeNamesPayload): IHttpCall<TDedupeNamesResponse> =>
	(httpLib) =>
		httpLib.post(DEDUPLICATION_ENDPOINT, potentialDupes, {
			withCredentials: true,
		});

// this optimistically extracts displayName and checks for its uniqueness, even
// if the image file in question has errs
export const getDupeDisplayNames =
	(imageFiles: TAllUploadedImages) => (deps: IDependencies<TAppAction>) =>
		tryCatch(
			() =>
				pipe(
					pipe(imageFiles, toPayload, requestDupes),
					deps.http,
					extractResponseData
				),
			(e) =>
				new BaseError(
					'Attempt to request duplicate displayNames from server failed.',
					e
				)
		);
