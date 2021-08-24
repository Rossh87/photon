import { Refinement } from 'fp-ts/Refinement';
import { ISavedBreakpoint } from 'sharedTypes/Breakpoint';
import {
	IBreakpointUI,
	TDefaultBreakpointUI,
	TUserBreakpointUI,
} from '../state/imageDialogState';

export const isUserBreakpoint: Refinement<IBreakpointUI, TUserBreakpointUI> =
	function (b): b is TUserBreakpointUI {
		return b.origin === 'user';
	};

export const isDefaultBreakpoint: Refinement<
	IBreakpointUI,
	TDefaultBreakpointUI
> = function (b): b is TDefaultBreakpointUI {
	return b.origin === 'default';
};
