import { pipe, flow } from 'fp-ts/lib/function';
import { nanoid } from 'nanoid';
import { map as ArrMap, sort, concatW } from 'fp-ts/Array';
import { Ord as NumOrd } from 'fp-ts/number';
import { TDefaultBreakpointUI } from '../state/imageDialogState';

const sortAscending = pipe(NumOrd, sort);

// Sensible default.  This will never force a browser to load an image that's more than
// one 'size' wider than viewport width
export const makeDefaultUIBreakpoint = (
	width: number
): TDefaultBreakpointUI => ({
	_id: nanoid(),
	queryType: 'max',
	mediaWidth: width,
	slotWidth: 100,
	slotUnit: 'vw',
	origin: 'default',
	editing: false,
	validationErrs: [null, null, null, null],
});

export const makeDefaultUIBreakpoints = flow(
	sortAscending,
	pipe(makeDefaultUIBreakpoint, ArrMap)
);
