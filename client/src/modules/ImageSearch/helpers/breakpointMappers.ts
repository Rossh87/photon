import { flow, pipe } from 'fp-ts/lib/function';
import { PayloadFPReader } from 'react-use-fp';
import { ISavedBreakpoint, TSavedBreakpoints } from 'sharedTypes/Breakpoint';
import {
	IBreakpointUI,
	TBreakpointFormValidationErrs,
	TDialogActions,
	TUserBreakpointUI,
} from '../state/imageDialogStateTypes';
import { map as ArrMap } from 'fp-ts/Array';

// map database breakpoint structure to the structure
// needed by our UI components
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
		] as unknown as TBreakpointFormValidationErrs,
		origin: 'user' as const,
	});

// map UI breakpoint structure to the structure needed by
// database
export const breakpointUIToBreakpoint = (a: IBreakpointUI): ISavedBreakpoint =>
	Object.assign(
		{},
		{
			queryType: a.queryType,
			mediaWidth: a.mediaWidth,
			slotWidth: a.slotWidth,
			slotUnit: a.slotUnit,
			_id: a._id,
		}
	);
