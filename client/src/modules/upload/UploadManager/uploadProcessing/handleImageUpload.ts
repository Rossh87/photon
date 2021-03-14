import {
	IResizingMetadata,
	IBlobWithIntegrityHash,
	IUploadURIMetadata,
	IAsyncUploadDependencies,
	IUploadsResponsePayload,
} from './uploadProcessingTypes';
import { flow, pipe, Predicate } from 'fp-ts/lib/function';
import {
	tryCatch,
	taskEitherSeq,
	chain as TEChain,
} from 'fp-ts/lib/TaskEither';
import { of as TOf } from 'fp-ts/lib/Task';
import {
	mapWithIndex as NEAMapWithIndex,
	sequence,
	NonEmptyArray,
} from 'fp-ts/lib/NonEmptyArray';
import { UploadError } from './UploadError';
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';
import { AxiosResponse } from 'axios';
import * as E from 'fp-ts/lib/Either';

// TODO: This whole file is a bit hacky and weird to get the right information
// into errors.  Can pry be refactored at some point.
export const handleImageUpload = (f: IResizingMetadata) => (
	uris: IUploadsResponsePayload
): ReaderTaskEither<
	IAsyncUploadDependencies,
	UploadError,
	NonEmptyArray<AxiosResponse<IBlobWithIntegrityHash>>
> => (deps: IAsyncUploadDependencies) => {
	// TODO: we could theoretically upload some files on partial successes
	return pipe(
		uris,
		leftIfHasFailures(f),
		E.map((res) => res.successes as NonEmptyArray<IUploadURIMetadata>),
		TOf,
		TEChain(
			flow(
				NEAMapWithIndex((i, uri) =>
					uploadOne(deps)(f.resizedBlobs[i])(uri)(f)
				),
				sequence(taskEitherSeq)
			)
		)
	);
};
const urisPredicate: Predicate<IUploadsResponsePayload> = (response) =>
	!!response.successes &&
	!(response.failures && response.failures.length !== 0);

const leftIfHasFailures = (resizeMetadata: IResizingMetadata) =>
	E.fromPredicate(urisPredicate, (responses) =>
		UploadError.create(
			'Some requests for resumable upload URIs failed',
			responses,
			resizeMetadata
		)
	);

const uploadOne = (deps: IAsyncUploadDependencies) => (
	blobData: IBlobWithIntegrityHash
) => (uriData: IUploadURIMetadata) => (resizeData: IResizingMetadata) =>
	tryCatch(
		() =>
			deps.fetcher
				.put<IBlobWithIntegrityHash>(
					uriData.resumableURI,
					blobData.blob
				)
				.then((res) => {
					console.log(res.data);
					return res;
				}),
		(e) => UploadError.create('Upload to CDN provider failed', e)
	);
