import {
	IDependencies,
	IHttpCall,
	WithSecondaryDispach,
} from '../../../core/dependencyContext';
import { DELETE_UPLOAD_ENDPOINT } from './endpoints';
import { tryCatch, TaskEither } from 'fp-ts/lib/TaskEither';
import { BaseError } from '../../../core/error';
import { pipe } from 'fp-ts/lib/function';
import { TDialogActions } from '../state/imageDialogStateTypes';
import { TImageSearchActions } from '../state/imageSearchStateTypes';

const requestDeletion =
	(idToDelete: string): IHttpCall<void> =>
	(httpLib) =>
		httpLib.delete(DELETE_UPLOAD_ENDPOINT(idToDelete), {
			withCredentials: true,
		});

export const deleteUpload =
	(idToDelete: string) =>
	(deps: WithSecondaryDispach<TDialogActions, TImageSearchActions>) =>
		tryCatch(
			() => pipe(requestDeletion(idToDelete), deps.http),
			(e) =>
				new BaseError(
					`Attempt to delete image ${idToDelete} failed.`,
					e
				)
		);
