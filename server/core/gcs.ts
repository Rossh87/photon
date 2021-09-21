import { Storage } from '@google-cloud/storage';
import { IDBUpload } from '../../sharedTypes/Upload';
import { BaseError, HTTPErrorTypes } from './error';

export const gcs = new Storage();

// configure bucket to allow CORS from our client domain
const bucketName = process.env.LOSSY_USER_IMAGES_BUCKET;
const uploadOrigin = process.env.UPLOAD_ORIGIN;

gcs.bucket(bucketName as string).setCorsConfiguration([
	{ maxAgeSeconds: 3600, method: ['put'], origin: [uploadOrigin as string] },
]);

export class PartialGCSDeletionFailure extends BaseError {
	public static create(failedPaths: string[], raw: any) {
		const devMessage = `Deletion of some paths for a GCS image failed`;
		return new PartialGCSDeletionFailure(devMessage, failedPaths, raw);
	}

	private constructor(
		devMessage: string,
		public readonly failedPaths: string[],
		raw: any
	) {
		super(devMessage, HTTPErrorTypes.BAD_GATEWAY, raw);
	}
}

export class TotalGCSDeletionFailure extends BaseError {
	public static create(failedDoc: IDBUpload, raw: any) {
		const devMessage = 'GCS document deletion totally failed';
		return new TotalGCSDeletionFailure(devMessage, failedDoc, raw);
	}

	private constructor(
		devMessage: string,
		public readonly failedDoc: IDBUpload,
		raw: any
	) {
		super(devMessage, HTTPErrorTypes.BAD_GATEWAY, raw);
	}
}
