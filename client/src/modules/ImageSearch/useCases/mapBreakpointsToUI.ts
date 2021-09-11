import { pipe } from 'fp-ts/lib/function';
import { PayloadFPReader } from 'react-use-fp';
import { TSavedBreakpoints } from 'sharedTypes/Breakpoint';
import { TImageConfigurationActions } from '../state/imageConfigurationStateTypes';
import { map as ArrMap } from 'fp-ts/Array';
import { breakpointToBreakpointUI } from '../helpers/breakpointMappers';

export const mapBreakpointsToUI: PayloadFPReader<
	TImageConfigurationActions,
	TSavedBreakpoints
> =
	(p) =>
	({ dispatch }) =>
	() => {};
