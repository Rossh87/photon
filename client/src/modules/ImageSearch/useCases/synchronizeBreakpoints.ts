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
import {
	IDependencies,
	WithAddedDependencies,
} from '../../../core/dependencyContext';
import { map as EMap, mapLeft as EMapLeft } from 'fp-ts/Either';
import { some } from 'fp-ts/lib/Option';
import { mapBreakpointsToUI } from './mapBreakpointsToUI';
import { TAuthActions } from '../../Auth/state/authStateTypes';
import { Dispatch } from 'react';
import { createSuccessMessage } from '../../Auth/state/useAuthState';

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
	WithAddedDependencies<
		TDialogActions,
		{ authDispatch: Dispatch<TAuthActions> }
	>
> = (p) =>
	pipe(
		ask<IDependencies<TDialogActions>>(),
		map(({ dispatch }) => dispatch({ type: 'SYNC_REQUEST_INITIALIZED' })),
		map(() => p),
		map(toTransferObject),
		chain(syncBreakpoints),
		RTChain((either) =>
			asks(({ dispatch, authDispatch }) =>
				pipe(
					either,
					EMap((updated) =>
						pipe(
							updated.breakpoints,
							ArrMap(breakpointToBreakpointUI),
							(bps) => {
								dispatch({
									type: 'BREAKPOINT_SYNC_SUCCESS',
									payload: bps,
								});
								authDispatch({
									type: 'ADD_APP_MESSAGE',
									payload: {
										messageKind: 'repeat',
										eventName: 'success',
										displayMessage: 'success!',
										severity: 'success',
										action: {
											kind: 'simple',
											handler: () =>
												authDispatch({
													type: 'REMOVE_APP_MESSAGE',
												}),
										},
										timeout: 2000,
									},
								});
							}
						)
					),
					EMapLeft((err) => {
						dispatch({
							type: 'BREAKPOINT_SYNC_FAILED',
							payload: some(err),
						});

						authDispatch({
							type: 'ADD_APP_MESSAGE',
							payload: {
								messageKind: 'repeat',
								eventName:
									'failed attempt to update breakpoints on server',
								displayMessage: err.message,
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
						});
					})
				)
			)
		)
	);
