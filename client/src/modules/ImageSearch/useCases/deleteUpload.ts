import { flow, pipe } from 'fp-ts/lib/function';
import { PayloadFPReader } from 'react-use-fp';
import { TDialogActions } from '../state/imageDialogStateTypes';
import {
	IBreakpointTransferObject,
	IUploadDeletionPayload,
	TUploadDeletionID,
} from 'sharedTypes/Upload';
import { breakpointUIToBreakpoint } from '../helpers/breakpointMappers';
import { IBreakpointSubmissionObject } from '../domain/imageSearchTypes';
import { map as ArrMap } from 'fp-ts/Array';
import { deleteUpload } from '../http/deleteUpload';
import { ask } from 'fp-ts/ReaderTaskEither';
import { WithAddedDependencies } from '../../../core/dependencyContext';
import { chain as RTChain, asks as RTAsks } from 'fp-ts/ReaderTask';
import * as E from 'fp-ts/Either';
import * as RTE from 'fp-ts/ReaderTaskEither';
import { TImageSearchActions } from '../state/imageSearchStateTypes';
import { Dispatch } from 'react';
import { TAuthActions } from '../../Auth/state/authStateTypes';

export const deleteOneUpload: PayloadFPReader<
	TDialogActions,
	IUploadDeletionPayload,
	WithAddedDependencies<
		TDialogActions,
		{
			imageSearchDispatch: Dispatch<TImageSearchActions>;
			authDispatch: Dispatch<TAuthActions>;
		}
	>
> = (toDelete) =>
	pipe(
		toDelete,
		deleteUpload,
		RTChain((result) =>
			RTAsks(({ authDispatch, imageSearchDispatch }) =>
				pipe(
					result,
					E.map(() => {
						imageSearchDispatch({
							type: 'DELETE_IMAGE',
							payload: toDelete.idToDelete,
						});
						authDispatch({ type: 'REMOVE_APP_MESSAGE' });
					}),
					E.mapLeft((e) =>
						authDispatch({
							type: 'ADD_APP_MESSAGE',
							payload: {
								messageKind: 'repeat',
								eventName: 'Attempt to delete upload failed',
								displayMessage: e.message,
								severity: 'error',
								action: {
									kind: 'simple',
									handler: () =>
										authDispatch({
											type: 'REMOVE_APP_MESSAGE',
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
