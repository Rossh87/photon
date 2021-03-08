import { IUploadRequestMetadata } from '../sharedUploadTypes';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { getEnvElseThrow } from '../../../core/readEnv';
import { tryCatch, mapLeft } from 'fp-ts/lib/TaskEither';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import {
	CreateResumableUploadOptions,
	CreateResumableUploadResponse,
} from '@google-cloud/storage';
import { reverseTwo } from '../../../core/utils/reverseCurried';
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';
import { pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export class ResumableUploadCreationErr extends BaseError {
	public static create(
		requestedUpload: IUploadRequestMetadata,
		rawError: any
	) {
		const devMessage = `attempt to initiate resumable upload for ${requestedUpload.displayName} was rejected by remote server`;
		return new ResumableUploadCreationErr(
			devMessage,
			rawError,
			requestedUpload
		);
	}

	private constructor(
		message: string,
		raw: any,
		public readonly requestedUpload: IUploadRequestMetadata
	) {
		super(message, HTTPErrorTypes.BAD_GATEWAY, raw);
	}
}

export const requestResumableUpload = (
	uploadMetaData: IUploadRequestMetadata
): ReaderTaskEither<
	Required<IAsyncDeps>,
	ResumableUploadCreationErr,
	CreateResumableUploadResponse
> => (deps) => {
	const bucketName = getEnvElseThrow(deps.readEnv)(
		'GOOGLE_STORAGE_BUCKET_NAME'
	);

	const opts: CreateResumableUploadOptions = {
		public: true,
		predefinedAcl: 'publicRead',
		metadata: {
			name: uploadMetaData.uploadPath,
			cacheControl: 'public, max-age=604800000',
			contentType: uploadMetaData.mediaType,
			contentEncoding: 'gzip',
			crc32: uploadMetaData.integrityHash,
		},
	};

	return tryCatch(
		() =>
			deps.gcs
				.bucket(bucketName)
				.file(uploadMetaData.displayName)
				.createResumableUpload(),
		(e) => ResumableUploadCreationErr.create(uploadMetaData, e)
	);
};

export const _requestResumableUpload = reverseTwo(requestResumableUpload);
