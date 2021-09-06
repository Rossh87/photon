import { IUploadRequestMetadata } from 'sharedTypes/Upload';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import {
	CreateResumableUploadOptions,
	CreateResumableUploadResponse,
} from '@google-cloud/storage';
import { reverseTwo } from '../../../core/utils/reverseCurried';
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';

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

export const requestResumableUpload =
	(
		uploadMetaData: IUploadRequestMetadata
	): ReaderTaskEither<
		IAsyncDeps,
		ResumableUploadCreationErr,
		CreateResumableUploadResponse
	> =>
	(deps) => {
		const bucketName = deps.readEnv('GOOGLE_STORAGE_BUCKET_NAME');
		const { ownerID, displayName, width } = uploadMetaData;

		const fileName = `${ownerID}/${displayName}/${width.toString()}`;

		const uploadOrigin = deps.readEnv('UPLOAD_ORIGIN');

		const opts: CreateResumableUploadOptions = {
			public: true,
			predefinedAcl: 'publicRead',
			origin: uploadOrigin,
			metadata: {
				name: fileName,
				cacheControl: 'public, max-age=604800000',
				contentType: uploadMetaData.mediaType,
				// contentEncoding: 'gzip',
				md5Hash: uploadMetaData.integrityHash,
			},
		};

		return tryCatch(
			() =>
				deps.gcs
					.bucket(bucketName)
					.file(fileName)
					.createResumableUpload(opts),
			(e) => ResumableUploadCreationErr.create(uploadMetaData, e)
		);
	};

export const _requestResumableUpload = reverseTwo(requestResumableUpload);
