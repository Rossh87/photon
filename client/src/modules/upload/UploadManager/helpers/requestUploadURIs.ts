import { IDependencies } from '../../../../core/sharedTypes';
import {
	IResizingData,
	IUploadRequestMetadata,
	IUploadsRequestPayload,
	IUploadsResponsePayload,
} from '../../../../core/imageReducer/resizeImage/imageReducerTypes';
import { REQUEST_UPLOAD_URI_ENDPOINT } from '../../../../CONSTANTS';
import { tryCatch, map as TEMap } from 'fp-ts/lib/TaskEither';
import { map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/function';
import { BaseError } from '../../../../core/error';

const toMetadata: (x: IResizingData) => IUploadsRequestPayload = (x) =>
	pipe(
		x.resizedBlobs,
		NEAMap((b) => b.metaData),
		(a) => ({ uploadRequests: a })
	);

export const requestUploadURIs = (image: IResizingData) => (
	deps: IDependencies
) =>
	tryCatch(
		() =>
			deps.fetcher
				.post<IUploadsResponsePayload>(
					REQUEST_UPLOAD_URI_ENDPOINT,
					toMetadata(image)
				)
				.then((res) => res.data),
		(e) =>
			new BaseError(
				'Attempt to get upload URI from server failed with the following reason: ',
				e
			)
	);
