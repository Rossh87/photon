// render a greyed-out item to indicate possibility of creating a new breakpoint
// beneath that, show all user-defined breakpoints in the order they specify
// finally, show greyed-out defaults that will always be present

import {
	ISavedBreakpoint,
	TBreakpointQueryType,
	TSavedBreakpointslotUnit,
} from '../../../../../sharedTypes/Breakpoint';
import { BaseError } from '../../../core/error';
import { makeNewUIBreakpoint } from '../helpers/makeNewUIBreakpoint';

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
type TBreakPointUIKinds = 'user' | 'default';

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

// This is for components taking breakpoint values from inputs,
// whose values are always a string
export interface ILocalBreakpointUI {
	queryType: TBreakpointQueryType;
	mediaWidth: string;
	slotWidth: string;
	slotUnit: TSavedBreakpointslotUnit;
	_id: string;
	origin: TBreakPointUIKinds;
	editing: boolean;
	validationErrs: TBreakpointFormValidationErrs;
}

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
	breakPoints: Array<TUserBreakpointUI>;
}

// dispatch regular breakpoints, and convert them in a handler
interface SetUIBreakpointsAction {
	type: 'SET_UI_BREAKPOINTS';
	payload: TUserBreakpointUI[];
}

interface CreateNewBreakpointAction {
	type: 'CREATE_NEW_BREAKPOINT';
}

interface UpdateOneBreakpointAction {
	type: 'UPDATE_ONE_BREAKPOINT';
	payload: TUserBreakpointUI;
}

interface DeleteBreakpointAction {
	type: 'DELETE_BREAKPOINT';
	payload: string;
}

export type TDialogActions =
	| DeleteBreakpointAction
	| SetUIBreakpointsAction
	| CreateNewBreakpointAction
	| UpdateOneBreakpointAction;

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
		case 'UPDATE_ONE_BREAKPOINT':
			return {
				...s,
				isSynchronizedWithBackend: false,
				breakPoints: s.breakPoints.map((bp) =>
					bp._id === a.payload._id ? a.payload : bp
				),
			};
		case 'DELETE_BREAKPOINT':
			return {
				...s,
				isSynchronizedWithBackend: false,
				breakPoints: s.breakPoints.filter((bp) => bp._id !== a.payload),
			};
		default:
			return s;
	}
};
