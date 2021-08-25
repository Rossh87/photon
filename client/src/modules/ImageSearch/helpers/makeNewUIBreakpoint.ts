import { TNewBreakpointUI } from '../state/imageDialogState';
import { nanoid } from 'nanoid';

export const makeNewUIBreakpoint = (): TNewBreakpointUI => ({
	_id: nanoid(),
	queryType: 'max',
	mediaWidth: 700,
	slotWidth: 100,
	slotUnit: 'vw',
	origin: 'new',
	editing: true,
	validationErrs: [null, null, null, null],
});
