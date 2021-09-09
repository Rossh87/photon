import { pipe } from 'fp-ts/lib/function';
import { PayloadFPReader } from 'react-use-fp';
import { TDialogActions } from '../state/imageDialogStateTypes';
import { IBreakpointTransferObject } from 'sharedTypes/Upload';
import {
	breakpointUIToBreakpoint,
	breakpointToBreakpointUI,
} from '../helpers/breakpointMappers';
import { IBreakpointSubmissionObject } from '../domain/imageSearchTypes';
import { map as ArrMap } from 'fp-ts/Array';
import { syncBreakpoints } from '../http/syncBreakpoints';
import { map, ask, asks, chain, flatten } from 'fp-ts/ReaderTaskEither';
import { chain as RTChain } from 'fp-ts/ReaderTask';
import { IDependencies } from '../../../core/dependencyContext';
import { map as EMap, mapLeft as EMapLeft } from 'fp-ts/Either';
import { some } from 'fp-ts/lib/Option';
import { mapBreakpointsToUI } from './mapBreakpointsToUI';

// We should ALWAYS update database, even if the submission object breakpoint array
// is empty--an empty state may represent the fact that the user has DELETED all their previous
// user-defined breakpoints.
const toTransferObject = (
	a: IBreakpointSubmissionObject
): IBreakpointTransferObject =>
	pipe(a.breakpoints, ArrMap(breakpointUIToBreakpoint), (bps) =>
		Object.assign({}, { imageID: a.imageID, breakpoints: bps })
	);

export const synchronizeBreakpoints: PayloadFPReader<
	TDialogActions,
	IBreakpointSubmissionObject,
	IDependencies<TDialogActions>
> = (p) =>
	pipe(
		ask<IDependencies<TDialogActions>>(),
		map(({ dispatch }) => dispatch({ type: 'SYNC_REQUEST_INITIALIZED' })),
		map(() => p),
		map(toTransferObject),
		chain(syncBreakpoints),
		RTChain((either) =>
			asks(({ dispatch }) =>
				pipe(
					either,
					EMap((updated) =>
						pipe(
							updated.breakpoints,
							ArrMap(breakpointToBreakpointUI),
							(bps) =>
								dispatch({
									type: 'BREAKPOINT_SYNC_SUCCESS',
									payload: bps,
								})
						)
					),
					EMapLeft((err) =>
						dispatch({
							type: 'BREAKPOINT_SYNC_FAILED',
							payload: some(err),
						})
					)
				)
			)
		)
	);
