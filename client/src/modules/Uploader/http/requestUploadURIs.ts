import {
	IDependencies,
	IHttpCall,
	THTTPRunner,
	extractResponseData,
} from '../../../core/dependencyContext';
import { IResizingData } from '../domain/domainTypes';
import { IUploadsRequestPayload, IUploadsResponsePayload } from './httpTypes';
import { REQUEST_UPLOAD_URI_ENDPOINT } from './endpoints';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { flow, pipe } from 'fp-ts/lib/function';
import { BaseError } from '../../../core/error';
import { local } from 'fp-ts/lib/ReaderTaskEither';
import { TAppAction } from '../../appState/appStateTypes';

const toMetadata: (x: IResizingData) => IUploadsRequestPayload = (x) => {
	return pipe(
		x.resizedBlobs,
		NEAMap((b) => b.metaData),
		(a) => ({ uploadRequests: a })
	);
};

const requestURIs =
	(imageData: IResizingData): IHttpCall<IUploadsResponsePayload> =>
	(httpLib) =>
		httpLib.post(REQUEST_UPLOAD_URI_ENDPOINT, toMetadata(imageData), {
			withCredentials: true,
		});

export const _requestUploadURIs =
	(imageData: IResizingData) => (httpRunner: THTTPRunner) =>
		tryCatch(
			() => pipe(imageData, requestURIs, httpRunner, extractResponseData),

			(e) =>
				new BaseError(
					'Attempt to get upload URIs from server failed.',
					e
				)
		);

export const requestUploadURIs = flow(
	_requestUploadURIs,
	local<IDependencies<TAppAction>, THTTPRunner>((deps) => deps.http)
);
