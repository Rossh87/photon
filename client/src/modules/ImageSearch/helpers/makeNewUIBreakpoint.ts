import { TNewBreakpointUI, TUserBreakpointUI } from '../state/imageDialogState';
import { nanoid } from 'nanoid';

// editing is open whenever we create a new breakpoint
export const makeNewUIBreakpoint = (): TUserBreakpointUI => ({
	_id: nanoid(),
	queryType: 'max',
	mediaWidth: 700,
	slotWidth: 100,
	slotUnit: 'vw',
	origin: 'user',
	editing: true,
	validationErrs: [null, null, null, null],
});
