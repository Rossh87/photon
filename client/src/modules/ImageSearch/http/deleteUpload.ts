import {
	IDependencies,
	IHttpCall,
} from '../../../core/dependencyContext';
import { DELETE_UPLOAD_ENDPOINT } from './endpoints';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { BaseError } from '../../../core/error';
import { pipe } from 'fp-ts/lib/function';
import { IUploadDeletionPayload } from '../../../../../sharedTypes/Upload';
import { TAppAction } from '../../appState/appStateTypes';

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
	(toDelete: IUploadDeletionPayload) => (deps: IDependencies<TAppAction>) =>
		tryCatch(
			() => pipe(requestDeletion(toDelete), deps.http),
			(e) =>
				new BaseError(
					`Attempt to delete image ${toDelete.idToDelete} failed.`,
					e
				)
		);
