import { ISavedBreakpoint } from 'sharedTypes/Breakpoint';
import {
	TBreakpointUI,
	TUserBreakpointUI,
} from '../state/imageConfigurationStateTypes';

// Breakpoint update form needs supplementary properties for tracking its edit state.
// This adds them.
export const breakpointToBreakpointUI = (
	a: ISavedBreakpoint
): TUserBreakpointUI =>
	Object.assign({}, a, {
		editing: false,
		origin: 'user' as const,
		mediaWidth: a.mediaWidth.toString(),
		slotWidth: a.slotWidth.toString(),
	});

// map UI breakpoint structure to the structure needed by
// main application state--in other words, it reverses the above
export const breakpointUIToBreakpoint = (a: TBreakpointUI): ISavedBreakpoint =>
	Object.assign(
		{},
		{
			mediaWidth: parseInt(a.mediaWidth),
			slotWidth: parseInt(a.slotWidth),
			queryType: a.queryType,
			slotUnit: a.slotUnit,
			_id: a._id,
		}
	);
