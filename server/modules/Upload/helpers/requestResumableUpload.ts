import { IUploadRequestMetadata } from '../sharedUploadTypes';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import {
	CreateResumableUploadOptions,
	CreateResumableUploadResponse,
} from '@google-cloud/storage';
import { reverseTwo } from '../../../core/utils/reverseCurried';
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';
import { UPLOAD_ORIGIN } from '../../../CONSTANTS';

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

// TODO: hash comparison always fails--need to know why
export const requestResumableUpload = (
	uploadMetaData: IUploadRequestMetadata
): ReaderTaskEither<
	IAsyncDeps,
	ResumableUploadCreationErr,
	CreateResumableUploadResponse
> => (deps) => {
	const bucketName = deps.readEnv('GOOGLE_STORAGE_BUCKET_NAME');
	const { ownerID, displayName, width } = uploadMetaData;

	const fileName = `${ownerID}/${displayName}/${width.toString()}`;

	const opts: CreateResumableUploadOptions = {
		public: true,
		predefinedAcl: 'publicRead',
		origin: UPLOAD_ORIGIN,
		metadata: {
			name: fileName,
			cacheControl: 'public, max-age=604800000',
			contentType: uploadMetaData.mediaType,
			// contentEncoding: 'gzip',
			// md5Hash: uploadMetaData.integrityHash,
		},
	};

	return tryCatch(
		() =>
			deps.gcs
				.bucket(bucketName)
				.file(fileName)
				.createResumableUpload(opts),
		(e) => {
			console.log('err hit in resumable upload request');
			return ResumableUploadCreationErr.create(uploadMetaData, e);
		}
	);
};

export const _requestResumableUpload = reverseTwo(requestResumableUpload);
