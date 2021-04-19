import {
	IHttpCall,
	extractResponseData,
	THTTPRunner,
	IDependencies,
} from '../../../core/dependencyContext';
import { IResizingData } from '../domain/domainTypes';
import { IUploadsRequestPayload, IUploadsResponsePayload } from './httpTypes';
import { REQUEST_UPLOAD_URI_ENDPOINT } from './endpoints';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { pipe, flow } from 'fp-ts/lib/function';
import { BaseError } from '../../../core/error';
import { local } from 'fp-ts/lib/ReaderTaskEither';
import { TUploaderActions } from '../state/uploadStateTypes';

const toMetadata: (x: IResizingData) => IUploadsRequestPayload = (x) =>
	pipe(
		x.resizedBlobs,
		NEAMap((b) => b.metaData),
		(a) => ({ uploadRequests: a })
	);

const requestURIs = (
	imageData: IResizingData
): IHttpCall<IUploadsResponsePayload> => (httpLib) =>
	httpLib.post(REQUEST_UPLOAD_URI_ENDPOINT, toMetadata(imageData), {
		withCredentials: true,
	});

export const _requestUploadURIs = (imageData: IResizingData) => (
	httpRunner: THTTPRunner
) =>
	tryCatch(
		() => pipe(imageData, requestURIs, httpRunner, extractResponseData),

		(e) =>
			new BaseError(
				'Attempt to get upload URI from server failed with the following reason: ',
				e
			)
	);

export const requestUploadURIs = flow(
	_requestUploadURIs,
	local<IDependencies<TUploaderActions>, THTTPRunner>((deps) => deps.http)
);
