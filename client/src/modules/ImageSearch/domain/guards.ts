import { Refinement } from 'fp-ts/Refinement';
import { ISavedBreakpoint } from 'sharedTypes/Breakpoint';
import {
	TBreakpointUI,
	TDefaultBreakpointUI,
	TUserBreakpointUI,
} from '../state/imageConfigurationStateTypes';

export const isUserBreakpoint: Refinement<TBreakpointUI, TUserBreakpointUI> =
	function (b): b is TUserBreakpointUI {
		return b.origin === 'user';
	};

export const isDefaultBreakpoint: Refinement<
	TBreakpointUI,
	TDefaultBreakpointUI
> = function (b): b is TDefaultBreakpointUI {
	return b.origin === 'default';
};
