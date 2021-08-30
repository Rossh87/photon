import {
	IDependencies,
	extractResponseData,
	IHttpCall,
} from '../../../core/dependencyContext';
import { SYNC_BREAKPOINT_ENDPOINT } from './endpoints';
import { TImageSearchActions } from '../state/imageSearchStateTypes';
import { tryCatch, TaskEither } from 'fp-ts/lib/TaskEither';
import { BaseError } from '../../../core/error';
import { IBreakpointTransferObject, IDBUpload } from 'sharedTypes/Upload';
import { pipe } from 'fp-ts/lib/function';
import { TDialogActions } from '../state/imageDialogState';

const putUpdated =
	(data: IBreakpointTransferObject): IHttpCall<IDBUpload> =>
	(httpLib) =>
		httpLib.put(SYNC_BREAKPOINT_ENDPOINT, data, { withCredentials: true });

export const syncBreakpoints =
	(data: IBreakpointTransferObject) =>
	(deps: IDependencies<TDialogActions>) =>
		tryCatch(
			() => pipe(data, putUpdated, deps.http, extractResponseData),
			(e) =>
				new BaseError(
					'Attempt to update image breakpoint data failed',
					e
				)
		);