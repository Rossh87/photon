// render a greyed-out item to indicate possibility of creating a new breakpoint
// beneath that, show all user-defined breakpoints in the order they specify
// finally, show greyed-out defaults that will always be present

import { ISavedBreakpoint } from '../../../../../sharedTypes/Breakpoint';
import { BaseError } from '../../../core/error';
import { makeNewUIBreakpoint } from '../helpers/makeNewUIBreakpoint';

// creating a new breakpoint:
// 1. generate a UID for bp--only needs to be unique amongst its siblings
// 2. populate with defaults.  'editing' status is true, accordion UI is open
// 3. accordion cannot be closed while bp is in editing mode
// 4. submit the updates by clicking button at right side of UI.  At this point,
// embed code should update
// 5. The new element needs a prop to know if it's new or not.  If it's new, discarding
// should remove it from the UI.  If it's an edit, discarding keeps it in the UI with unmodified values
type TBreakpointFormValidationErr = string | null;
// lightweight way to track errs on input values.  The string is the err message.
// use a tuple type to keep relationship between err and the form field, since field order
// shouldn't change
export type TBreakpointFormValidationErrs = [
	TBreakpointFormValidationErr,
	TBreakpointFormValidationErr,
	TBreakpointFormValidationErr,
	TBreakpointFormValidationErr
];
// BP state needs: built-in BP props to include an _id prop, a kind indicating whether it is 'new', 'default', 'user-defined' (trackable through 'origin' prop?),
// an 'isUnderEdit" status,
type TBreakPointUIKinds = 'user' | 'new' | 'default';

export interface IBreakpointUI extends ISavedBreakpoint {
	origin: TBreakPointUIKinds;
	editing: boolean;
	validationErrs: TBreakpointFormValidationErrs;
}

export type TDefaultBreakpointUI = IBreakpointUI & {
	origin: 'default';
};

export type TUserBreakpointUI = IBreakpointUI & {
	origin: 'user';
};

export type TNewBreakpointUI = IBreakpointUI & {
	origin: 'new';
};

export type TUIBreakpoints = IBreakpointUI[];

// BP listElement handlers needed are a passed-in handler to submit updates, and a passed in handler to delete a breakpoint

// updating an existing BP:
// 1. accordion opens on click
// 2. as soon as a property is changed, the item is in editing mode.  It cannot
// be collapsed until user explicitly submits or discards. If NOT in editing mode, clicking off the element
// collapses it.

// Closing the Dialog:
// 1. Dialog itself needs to know if backend has been synced
// 2. Clicking off or closing should trigger a prompt to either discard or save
// changes if any breakpoint is in editing mode
// 3. submit logic follows following flow: Are there open edits? If so, flag them and do not submit.
// If not, is the Dialog component in-sync with the backend?  If so, do nothing.  If not, send update info to server.  On success,
// set Dialog component to synced.  On failure, DO NOT CHANGE sync status, and set an err/message status displaying the problem to the user.

// Dialog needs: Track sync status, track err status, track pending status,
// track all user-defined breakpoints, update a user-defined breakpoint, re-order UD breakpoint,
// delete a UD-breakpoint,
// and access to user id for updating their breakpoint data

export interface IDialogState {
	isSynchronizedWithBackend: boolean;
	error: BaseError | null;
	requestPending: boolean;
	breakPoints: Array<IBreakpointUI>;
}

// dispatch regular breakpoints, and convert them in a handler
interface SetUIBreakpointsAction {
	type: 'SET_UI_BREAKPOINTS';
	payload: TUserBreakpointUI[];
}

interface CreateNewBreakpointAction {
	type: 'CREATE_NEW_BREAKPOINT';
}

export type TDialogActions = SetUIBreakpointsAction | CreateNewBreakpointAction;

export const initialDialogState: IDialogState = {
	isSynchronizedWithBackend: true,
	error: null,
	requestPending: false,
	breakPoints: [],
};

export const imageDialogReducer: React.Reducer<IDialogState, TDialogActions> = (
	s,
	a
) => {
	switch (a.type) {
		case 'SET_UI_BREAKPOINTS':
			return { ...s, breakPoints: a.payload };
		case 'CREATE_NEW_BREAKPOINT':
			return {
				...s,
				breakPoints: [makeNewUIBreakpoint(), ...s.breakPoints],
			};
		default:
			return s;
	}
};
