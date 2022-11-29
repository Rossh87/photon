import {
	IDependencies,
	IHttpCall,
	extractResponseData,
} from '../../../core/dependencyContext';
import { SYNC_BREAKPOINT_ENDPOINT } from './endpoints';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { BaseError } from '../../../core/error';
import { IBreakpointTransferObject, IClientUpload } from 'sharedTypes/Upload';
import { pipe } from 'fp-ts/lib/function';
import { TAppAction } from '../../appState/appStateTypes';

const putUpdated =
	(data: IBreakpointTransferObject): IHttpCall<IClientUpload> =>
	(httpLib) =>
		httpLib.put(SYNC_BREAKPOINT_ENDPOINT, data, { withCredentials: true });

export const syncBreakpoints =
	(data: IBreakpointTransferObject) => (deps: IDependencies<TAppAction>) =>
		tryCatch(
			() => pipe(data, putUpdated, deps.http, extractResponseData),
			(e) =>
				new BaseError(
					'Attempt to update image breakpoint data failed',
					e
				)
		);
