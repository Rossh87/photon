import {
	IUploadsResponsePayload,
	IResizingData,
	IUploadURIMetadata,
} from '../../../../core/imageReducer/resizeImage/imageReducerTypes';
import { pipe, flow } from 'fp-ts/lib/function';
import { map as EMap, Either, left, right } from 'fp-ts/lib/Either';
import {
	map as TEMap,
	chain as TEChain,
	tryCatch,
	sequenceArray,
} from 'fp-ts/lib/TaskEither';
import { of as TOf } from 'fp-ts/lib/Task';
import { IAsyncDependencies } from '../../../../core/sharedTypes';
import { BaseError } from '../../../../core/error';
import {
	NonEmptyArray,
	mapWithIndex as NEAMapWithIdx,
} from 'fp-ts/lib/NonEmptyArray';

const leftIfHasErrors = (res: IUploadsResponsePayload) =>
	(res.failures && res.failures.length) ||
	(res.successes && res.successes.length === 0)
		? left(
				new BaseError(
					'Some or all requests for upload URIs failed, or no successes were received',
					res.failures
				)
		  )
		: right(res.successes as NonEmptyArray<IUploadURIMetadata>);

export const uploadToGCS = (images: IResizingData) => (
	response: IUploadsResponsePayload
) => (deps: IAsyncDependencies) =>
	pipe(
		response,
		leftIfHasErrors,
		// lift to Task to avoid a weird return type
		TOf,
		TEChain(
			flow(
				NEAMapWithIdx((i, uri) =>
					tryCatch(
						() =>
							deps.fetcher.put(
								uri.resumableURI,
								images.resizedBlobs[i].blob
							),
						(e) =>
							new BaseError(
								`Attempt to upload ${images.resizedBlobs[i].metaData.displayName} at width ${images.resizedBlobs[i].metaData.width} failed.`,
								e
							)
					)
				),
				sequenceArray
			)
		)
	);
