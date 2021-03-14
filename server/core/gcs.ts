import { Storage } from '@google-cloud/storage';
import { UPLOAD_ORIGIN } from '../CONSTANTS';

export const gcs = new Storage();

// configure bucket to allow CORS from our client domain
const bucketName = process.env.GOOGLE_STORAGE_BUCKET_NAME;

gcs.bucket(bucketName as string).setCorsConfiguration([
	{ maxAgeSeconds: 3600, method: ['put'], origin: [UPLOAD_ORIGIN] },
]);
