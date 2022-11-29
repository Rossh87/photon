import { pipe } from 'fp-ts/lib/function';
import { PayloadFPReader } from 'react-use-fp';
import { TImageConfigurationActions } from '../state/imageConfigurationStateTypes';
import { IBreakpointTransferObject } from 'sharedTypes/Upload';
import { syncBreakpoints } from '../http/syncBreakpoints';
import { ask, asks, chain, map } from 'fp-ts/ReaderTaskEither';
import { chain as RTChain } from 'fp-ts/ReaderTask';
import { IDependencies } from '../../../core/dependencyContext';
import { map as EMap, mapLeft as EMapLeft } from 'fp-ts/Either';
import { TAppAction } from '../../appState/appStateTypes';

// We should ALWAYS update database, even if the submission object breakpoint array
// is empty--an empty state may represent the fact that the user has DELETED all their previous
// user-defined breakpoints.
export const synchronizeBreakpoints: PayloadFPReader<
	TAppAction,
	IBreakpointTransferObject,
	IDependencies<TAppAction>
> = (p) =>
	pipe(
		ask<IDependencies<TImageConfigurationActions>>(),
		map(() => p),
		chain(syncBreakpoints),
		RTChain((either) =>
			asks(({ dispatch }) =>
				pipe(
					either,
					EMap((updated) =>
						pipe(updated.breakpoints, (bps) => {
							dispatch({
								type: 'IMAGE_CONFIG/BREAKPOINT_SYNC_SUCCESS',
								payload: {
									imageID: p.imageID,
									breakpoints: bps,
								},
							});
							dispatch({
								type: 'META/ADD_APP_MESSAGE',
								payload: {
									messageKind: 'repeat',
									eventName: 'success',
									displayMessage: 'success!',
									severity: 'success',
									action: {
										kind: 'simple',
										handler: () =>
											dispatch({
												type: 'META/REMOVE_APP_MESSAGE',
											}),
									},
									timeout: 2000,
								},
							});
						})
					),
					EMapLeft((err) => {
						dispatch({
							type: 'META/ADD_APP_MESSAGE',
							payload: {
								messageKind: 'repeat',
								eventName:
									'failed attempt to update breakpoints on server',
								displayMessage: err.message,
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
						});
					})
				)
			)
		)
	);
