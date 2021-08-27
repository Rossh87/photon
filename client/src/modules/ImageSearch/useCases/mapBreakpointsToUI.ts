import { pipe } from 'fp-ts/lib/function';
import { PayloadFPReader } from 'react-use-fp';
import { TSavedBreakpoints } from 'sharedTypes/Breakpoint';
import { TDialogActions } from '../state/imageDialogState';
import { map as ArrMap } from 'fp-ts/Array';
import { breakpointToBreakpointUI } from '../helpers/breakpointMappers';

export const mapBreakpointsToUI: PayloadFPReader<
	TDialogActions,
	TSavedBreakpoints
> =
	(p) =>
	({ dispatch }) =>
	() =>
		pipe(p, ArrMap(breakpointToBreakpointUI), (bps) =>
			dispatch({ type: 'SET_UI_BREAKPOINTS', payload: bps })
		);
