import spark from 'spark-md5';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { ImageReducerError } from '../../domain/ImageReducerError';
import { identity, flow } from 'fp-ts/lib/function';
export const calculateBlobMD5Hash = (b: Blob) =>
	tryCatch(
		() => getHash(b),
		(e) => ImageReducerError.create(b, e, 'unable to calculate MD5 hash')
	);

// second param 'true' causes func to return hash binary string rather than
// hash hex string
const hashBuffer = (b: ArrayBuffer) => spark.ArrayBuffer.hash(b, true);

// catch error and pass it up to tryCatch handler
const getHash = (b: Blob): Promise<string> =>
	b.arrayBuffer().then(hashBuffer).then(btoa).catch(identity);
