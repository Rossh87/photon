import { pipe } from 'fp-ts/lib/function';
import { PayloadFPReader } from 'react-use-fp';
import { TImageConfigurationActions } from '../state/imageConfigurationStateTypes';
import { IUploadDeletionPayload } from 'sharedTypes/Upload';
import { deleteUpload } from '../http/deleteUpload';
import { IDependencies } from '../../../core/dependencyContext';
import { asks as RTAsks, chain as RTChain } from 'fp-ts/ReaderTask';
import * as E from 'fp-ts/Either';
import { TAppAction } from '../../appState/appStateTypes';

export const deleteOneUpload: PayloadFPReader<
	TImageConfigurationActions,
	IUploadDeletionPayload,
	IDependencies<TAppAction>
> = (toDelete) =>
	pipe(
		toDelete,
		deleteUpload,
		RTChain((result) =>
			RTAsks(({ dispatch }) =>
				pipe(
					result,
					E.map(() => {
						dispatch({
							type: 'IMAGES/DELETE_IMAGE',
							payload: toDelete.idToDelete,
						});
						dispatch({ type: 'META/REMOVE_APP_MESSAGE' });
					}),
					E.mapLeft((e) =>
						dispatch({
							type: 'META/ADD_APP_MESSAGE',
							payload: {
								messageKind: 'repeat',
								eventName: 'Attempt to delete upload failed',
								displayMessage: e.message,
								severity: 'error',
								action: {
									kind: 'simple',
									handler: () =>
										dispatch({
											type: 'META/REMOVE_APP_MESSAGE',
										}),
								},
								timeout: 10000,
							},
						})
					)
				)
			)
		)
	);
