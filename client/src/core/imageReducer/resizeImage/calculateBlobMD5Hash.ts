import { MD5, enc } from 'crypto-js';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { ImageReducerError } from './ImageReducerError';
import { pipe } from 'fp-ts/lib/function';

export const calculateBlobMD5Hash = (b: Blob) =>
	tryCatch(
		() => getHash(b),
		(e) => ImageReducerError.create(b, e, 'unable to calculate MD5 hash')
	);

const getHash = (b: Blob): Promise<string> =>
	new Promise((res, rej) => {
		const reader = new FileReader();
		reader.onloadend = () =>
			reader.result && typeof reader.result === 'string'
				? pipe(reader.result, MD5, enc.Base64.stringify, res)
				: rej('attempt to read Blobl to binary string failed');

		reader.readAsBinaryString(b);
	});