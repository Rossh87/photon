import { pipe } from 'fp-ts/lib/function';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import {
	IHTTPLib,
	THTTPRunner,
	IDependencies,
} from '../../../core/dependencyContext';
import { TUploaderActions } from '../state/uploadStateTypes';
import { BaseError } from '../../../core/error';
import { IUploadableBlob } from '../domain/domainTypes';
import { local } from 'fp-ts/lib/ReaderTaskEither';
import { ap } from 'fp-ts/lib/Identity';

const uploadImage = (uploadURI: string) => (imageData: IUploadableBlob) => (
	httpLib: IHTTPLib
) => httpLib.put(uploadURI, imageData.blob);

const _uploadOneImageToGCS = (uploadURI: string) => (
	imageData: IUploadableBlob
) => (httpRunner: THTTPRunner) =>
	tryCatch(
		() => pipe(uploadImage(uploadURI)(imageData), httpRunner),
		(e) =>
			new BaseError(
				`Attempt to upload ${imageData.metaData.displayName} at width ${imageData.metaData.width} failed.`,
				e
			)
	);

export const uploadOneImageToGCS = (uploadURI: string) => (
	imageData: IUploadableBlob
) =>
	pipe(
		_uploadOneImageToGCS,
		ap(uploadURI),
		ap(imageData),
		local<IDependencies<TUploaderActions>, THTTPRunner>((deps) => deps.http)
	);
