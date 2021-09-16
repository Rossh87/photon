import { TPreprocessArgs } from '../../domain/domainTypes';
import {
	fromPredicate,
} from 'fp-ts/Either';
import { MAX_DEMO_UPLOAD_COUNT } from 'sharedTypes/CONSTANTS';
import { BaseError } from '../../../../core/error';

export const checkAvailableUploads = fromPredicate<TPreprocessArgs, BaseError>(
	([fileList, user]) =>
		user.accessLevel !== 'demo' ||
		user.imageCount + fileList.length <= MAX_DEMO_UPLOAD_COUNT,
	([_, user]) =>
		new BaseError(
			`A maximum of ${MAX_DEMO_UPLOAD_COUNT} uploads are available while app is in demo mode, you have ${
				MAX_DEMO_UPLOAD_COUNT - user.imageCount
			} remaining`
		)
);
