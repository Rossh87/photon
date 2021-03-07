import { IUploadRequestMetadata } from '../sharedUploadTypes';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { getEnvElseThrow } from '../../../core/readEnv';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import { CreateResumableUploadOptions } from '@google-cloud/storage';

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
) => (deps: Required<IAsyncDeps>) => {
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
