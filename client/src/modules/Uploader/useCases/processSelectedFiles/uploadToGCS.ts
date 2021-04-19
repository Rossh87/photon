import {
	IUploadsResponsePayload,
	IUploadURIMetadata,
} from '../../http/httpTypes';
import { IResizingData } from '../../domain/domainTypes';
import { pipe, flow } from 'fp-ts/lib/function';
import { left, right } from 'fp-ts/lib/Either';
import { chain as TEChain, sequenceArray } from 'fp-ts/lib/TaskEither';
import { of as TOf } from 'fp-ts/lib/Task';
import { IDependencies } from '../../../../core/dependencyContext';
import { BaseError } from '../../../../core/error';
import {
	NonEmptyArray,
	mapWithIndex as NEAMapWithIdx,
} from 'fp-ts/lib/NonEmptyArray';
import { TUploaderActions } from '../../state/uploadStateTypes';
import { uploadOneImageToGCS } from '../../http/uploadOneImageToGCS';

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
) => (deps: IDependencies<TUploaderActions>) =>
	pipe(
		response,
		leftIfHasErrors,
		// lift to Task to avoid a weird return type
		TOf,
		TEChain(
			flow(
				NEAMapWithIdx((i, uri) =>
					uploadOneImageToGCS(uri.resumableURI)(
						images.resizedBlobs[i]
					)(deps)
				),
				sequenceArray
			)
		)
	);
