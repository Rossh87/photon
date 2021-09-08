import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { TDBUser, TSessionUser } from 'sharedTypes/User';
import { IUploadRequestMetadata } from 'sharedTypes/Upload';
import { MAX_DEMO_UPLOAD_COUNT } from 'sharedTypes/CONSTANTS';
import { left, right } from 'fp-ts/Either';
import { BaseError, HTTPErrorTypes } from '../../../core/error';

export const confirmAvailableUploadCount = (
	user: TSessionUser,
	uploadRequests: NonEmptyArray<IUploadRequestMetadata>
) =>
	user.accessLevel !== 'demo' ||
	user.imageCount + uploadRequests.length <= MAX_DEMO_UPLOAD_COUNT
		? right(uploadRequests)
		: left(
				new BaseError(
					'Request exceeds max number of uploads for user running in "demo" mode',
					HTTPErrorTypes.FORBIDDEN
				)
		  );
