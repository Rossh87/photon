import { flow, pipe } from 'fp-ts/lib/function';
import { PayloadFPReader } from 'react-use-fp';
import {
	ISavedBreakpoint,
	TSavedBreakpoints,
} from '../../../../../sharedTypes/Breakpoint';
import {
	TBreakpointFormValidationErrs,
	TDialogActions,
	TUserBreakpointUI,
} from '../state/imageDialogState';
import { map as ArrMap } from 'fp-ts/Array';

export const breakpointToBreakpointUI = (
	a: ISavedBreakpoint
): TUserBreakpointUI =>
	Object.assign(a, {
		editing: false,
		validationErrs: [
			null,
			null,
			null,
			null,
		] as TBreakpointFormValidationErrs,
		origin: 'user' as const,
	});

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
