import {
	IResizingMetadata,
	IUploadRequestMetadata,
	IBlobWithIntegrityHash,
	IAsyncUploadDependencies,
	IUploadsRequestPayload,
	IUploadsResponsePayload,
} from './uploadProcessingTypes';
import { REQUEST_UPLOAD_URI_ENDPOINT } from '../../../../CONSTANTS';
import { pipe } from 'fp-ts/lib/function';
import { tryCatch, chain, bindTo, map, of } from 'fp-ts/lib/TaskEither';
import { map as NEAmap } from 'fp-ts/lib/NonEmptyArray';
import { UploadError } from './UploadError';
import { AxiosResponse } from 'axios';

export const requestUploadURIs = (f: IResizingMetadata) => (
	deps: IAsyncUploadDependencies
) =>
	pipe(
		of<UploadError, IResizingMetadata>(f),
		map(toUploadRequestMetadata),
		map(NEAmap),
		map((toMetadata) => toMetadata(f.resizedBlobs)),
		bindTo('uploadRequests'),
		chain((x) => {
			console.log('uploadMD: ', x);
			return getUploadURIs(x)(f)(deps);
		})
	);

const getUploadURIs = (requests: IUploadsRequestPayload) => (
	resizeData: IResizingMetadata
) => (deps: IAsyncUploadDependencies) =>
	tryCatch(
		() =>
			pipe(
				deps.fetcher
					.post<
						IUploadsRequestPayload,
						AxiosResponse<IUploadsResponsePayload>
					>(REQUEST_UPLOAD_URI_ENDPOINT, requests, {
						withCredentials: true,
					})
					.then((res) => res.data)
			),

		(e) =>
			UploadError.create(
				'Request to initiate an upload was unsuccessful',
				e,
				resizeData
			)
	);

const toUploadRequestMetadata = (resizeMetadata: IResizingMetadata) => (
	blobData: IBlobWithIntegrityHash
): IUploadRequestMetadata => {
	return {
		ownerID: resizeMetadata.ownerID,
		displayName: resizeMetadata.displayName,
		sizeInBytes: blobData.blob.size,
		integrityHash: blobData.integrityHash,
		mediaType: resizeMetadata.type,
		sizeParam: blobData.sizeParam,
	};
};
