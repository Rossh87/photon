import { ICombinedUploadRequestMetadata } from '../sharedUploadTypes';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { tryCatch, map, chain } from 'fp-ts/lib/TaskEither';
import { BaseError } from '../../../core/error';
import { HTTPErrorTypes } from '../../../core/error';
import { getCollection, trySaveOne } from '../../../core/repo';
import { pipe } from 'fp-ts/lib/function';

export class SaveUploadMetaDataError extends BaseError {
	public static create(
		failedMetadata: ICombinedUploadRequestMetadata,
		rawError: any
	) {
		const devMessage = `attempt to save metadata for successful image uploads failed`;

		return new SaveUploadMetaDataError(
			devMessage,
			rawError,
			failedMetadata
		);
	}

	private constructor(
		message: string,
		raw: any,
		public readonly failedMetadata: ICombinedUploadRequestMetadata
	) {
		super(message, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
	}
}

export const saveUploadMetadata = (data: ICombinedUploadRequestMetadata) => (
	deps: IAsyncDeps
) =>
	pipe(
		deps.repoClient,
		getCollection<ICombinedUploadRequestMetadata>('uploads'),
		trySaveOne(data)
	);
