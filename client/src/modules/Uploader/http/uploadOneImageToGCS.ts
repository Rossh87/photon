import { pipe } from 'fp-ts/lib/function';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import {
	IDependencies,
	IHTTPLib,
	THTTPRunner,
} from '../../../core/dependencyContext';
import { BaseError } from '../../../core/error';
import { IUploadableBlob } from '../domain/domainTypes';
import { local } from 'fp-ts/lib/ReaderTaskEither';
import { ap } from 'fp-ts/lib/Identity';
import { TAppAction } from '../../appState/appStateTypes';

const uploadImage =
	(uploadURI: string) =>
	(imageData: IUploadableBlob) =>
	(httpLib: IHTTPLib) =>
		httpLib.put(uploadURI, imageData.blob);

const _uploadOneImageToGCS =
	(uploadURI: string) =>
	(imageData: IUploadableBlob) =>
	(httpRunner: THTTPRunner) =>
		tryCatch(
			() => pipe(uploadImage(uploadURI)(imageData), httpRunner),
			(e) =>
				new BaseError(
					`Attempt to upload ${imageData.metaData.displayName} at width ${imageData.metaData.width} failed.`,
					e
				)
		);

export const uploadOneImageToGCS =
	(uploadURI: string) => (imageData: IUploadableBlob) =>
		pipe(
			_uploadOneImageToGCS,
			ap(uploadURI),
			ap(imageData),
			local<IDependencies<TAppAction>, THTTPRunner>((deps) => deps.http)
		);
