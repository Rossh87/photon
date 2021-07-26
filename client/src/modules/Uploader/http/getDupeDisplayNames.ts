import { IImage } from '../domain/domainTypes';
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

const toPayload: (as: NonEmptyArray<IImage>) => TDedupeNamesPayload = flow(
	NEAmap<IImage, string>((x) => x.displayName),
	(displayNames) => ({ displayNames })
);

const requestDupes =
	(potentialDupes: TDedupeNamesPayload): IHttpCall<TDedupeNamesResponse> =>
	(httpLib) =>
		httpLib.post(DEDUPLICATION_ENDPOINT, potentialDupes);

export const getDupeDisplayNames =
	(imageFiles: Array<IImage>) => (deps: IDependencies<TUploaderActions>) =>
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
