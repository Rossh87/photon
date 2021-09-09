import {
	ILocalBreakpointUI,
	IBreakpointUI,
} from '../state/imageDialogStateTypes';

export const formatBPStateForDispatch = (
	bpState: ILocalBreakpointUI
): IBreakpointUI =>
	Object.assign({}, bpState, {
		mediaWidth: parseInt(bpState.mediaWidth),
		slotWidth: parseInt(bpState.slotWidth),
	});

export const formatBPPropsForLocal = (
	propState: IBreakpointUI
): ILocalBreakpointUI =>
	Object.assign({}, propState, {
		mediaWidth: propState.mediaWidth.toString(),
		slotWidth: propState.slotWidth.toString(),
	});
