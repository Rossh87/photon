import { pipe, flow } from 'fp-ts/lib/function';
import { nanoid } from 'nanoid';
import { map as ArrMap, sort, concatW } from 'fp-ts/Array';
import { Ord as NumOrd } from 'fp-ts/number';
import { TDefaultBreakpointUI } from '../state/imageConfigurationStateTypes';
import { ISavedBreakpoint } from '../../../../../sharedTypes/Breakpoint';

const sortAscending = pipe(NumOrd, sort);

// Sensible default.  This will never force a browser to load an image that's more than
// one 'size' wider than viewport width
export const makeDefaultBreakpoint = (width: number): ISavedBreakpoint => ({
	_id: nanoid(),
	queryType: 'max',
	mediaWidth: width,
	slotWidth: 100,
	slotUnit: 'vw',
});

export const makeDefaultBreakpoints = flow(
	sortAscending,
	pipe(makeDefaultBreakpoint, ArrMap)
);
