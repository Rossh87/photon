import {
	IDependencies,
	IHttpCall,
	WithAddedDependencies,
} from '../../../core/dependencyContext';
import { DELETE_UPLOAD_ENDPOINT } from './endpoints';
import { tryCatch, TaskEither } from 'fp-ts/lib/TaskEither';
import { BaseError } from '../../../core/error';
import { pipe } from 'fp-ts/lib/function';
import { TDialogActions } from '../state/imageDialogStateTypes';
import { TImageSearchActions } from '../state/imageSearchStateTypes';
import { Dispatch } from 'react';
import { IUploadDeletionPayload } from '../../../../../sharedTypes/Upload';

const requestDeletion =
	({
		idToDelete,
		updatedImageCount,
	}: IUploadDeletionPayload): IHttpCall<void> =>
	(httpLib) =>
		httpLib.delete(DELETE_UPLOAD_ENDPOINT(idToDelete), {
			withCredentials: true,
			params: { updatedImageCount },
		});

export const deleteUpload =
	(toDelete: IUploadDeletionPayload) =>
	(
		deps: WithAddedDependencies<
			TDialogActions,
			{ imageSearchDispatch: Dispatch<TImageSearchActions> }
		>
	) =>
		tryCatch(
			() => pipe(requestDeletion(toDelete), deps.http),
			(e) =>
				new BaseError(
					`Attempt to delete image ${toDelete.idToDelete} failed.`,
					e
				)
		);
