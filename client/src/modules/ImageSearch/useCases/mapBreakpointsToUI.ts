import { PayloadFPReader } from 'react-use-fp';
import { TSavedBreakpoints } from 'sharedTypes/Breakpoint';
import { TImageConfigurationActions } from '../state/imageConfigurationStateTypes';

export const mapBreakpointsToUI: PayloadFPReader<
	TImageConfigurationActions,
	TSavedBreakpoints
> =
	(p) =>
	({ dispatch }) =>
	() => {};
