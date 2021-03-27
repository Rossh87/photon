import {
	IUploadsResponsePayload,
	IResizingData,
	IUploadURIMetadata,
} from '../../../../core/imageReducer/resizeImage/imageReducerTypes';
import { pipe } from 'fp-ts/lib/function';
import { map as EMap, Either, left, right } from 'fp-ts/lib/Either';
import { map as TEMap, chain as TEChain, tryCatch } from 'fp-ts/lib/TaskEither';
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

export const doUpload = (images: IResizingData) => (
	response: IUploadsResponsePayload
) => (deps: IAsyncDependencies) =>
	pipe(
		response,
		leftIfHasErrors,
		EMap((uris) =>
			pipe(
				uris,
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
				)
			)
		)
	);
