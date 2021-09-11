import { nanoid } from 'nanoid';
import { ISavedBreakpoint } from 'sharedTypes/Breakpoint';

// editing is open whenever we create a new breakpoint
export const makeNewUIBreakpoint = (): ISavedBreakpoint => ({
	_id: nanoid(),
	queryType: 'max',
	mediaWidth: 700,
	slotWidth: 100,
	slotUnit: 'vw',
});
