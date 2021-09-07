import { flow, pipe } from 'fp-ts/lib/function';
import { PayloadFPReader } from 'react-use-fp';
import { TDialogActions } from '../state/imageDialogState';
import {
	IBreakpointTransferObject,
	TUploadDeletionID,
} from 'sharedTypes/Upload';
import { breakpointUIToBreakpoint } from '../helpers/breakpointMappers';
import { IBreakpointSubmissionObject } from '../domain/imageSearchTypes';
import { map as ArrMap } from 'fp-ts/Array';
import { deleteUpload } from '../http/deleteUpload';
import { ask } from 'fp-ts/ReaderTaskEither';
import { WithSecondaryDispach } from '../../../core/dependencyContext';
import { chain as RTChain, asks as RTAsks } from 'fp-ts/ReaderTask';
import * as E from 'fp-ts/Either';
import * as RTE from 'fp-ts/ReaderTaskEither';
import { TImageSearchActions } from '../state/imageSearchStateTypes';

export const deleteOneUpload: PayloadFPReader<
	TDialogActions,
	TUploadDeletionID,
	WithSecondaryDispach<TDialogActions, TImageSearchActions>
> = (id: TUploadDeletionID) =>
	pipe(
		id,
		deleteUpload,
		RTChain((result) =>
			RTAsks(({ dispatch, secondaryDispatch }) =>
				pipe(
					result,
					E.map(() =>
						secondaryDispatch({ type: 'DELETE_IMAGE', payload: id })
					),
					E.mapLeft((e) =>
						dispatch({ type: 'ADD_ERROR', payload: e })
					)
				)
			)
		)
	);
