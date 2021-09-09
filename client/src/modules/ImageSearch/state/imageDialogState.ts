import { none, some } from 'fp-ts/lib/Option';
import { makeNewUIBreakpoint } from '../helpers/makeNewUIBreakpoint';
import { IDialogState, TDialogActions } from './imageDialogStateTypes';

export const initialDialogState: IDialogState = {
	isSynchronizedWithBackend: true,
	error: none,
	requestPending: false,
	breakpoints: [],
	snackbarStatus: 'none',
	hasUpdated: false,
};

export const imageDialogReducer: React.Reducer<IDialogState, TDialogActions> = (
	s,
	a
) => {
	switch (a.type) {
		case 'SET_UI_BREAKPOINTS':
			return { ...s, breakpoints: a.payload };
		case 'CREATE_NEW_BREAKPOINT':
			return {
				...s,
				breakpoints: [makeNewUIBreakpoint(), ...s.breakpoints],
			};
		// NB this respects the existing order of breakpoints.  Important for
		// 'SUCCESS' action.  This is only for LOCAL state,
		// does not trigger the 'hasUpdated' property--that is reserved
		// for updates made to the backend.
		case 'UPDATE_ONE_BREAKPOINT':
			return {
				...s,
				isSynchronizedWithBackend: false,
				breakpoints: s.breakpoints.map((bp) =>
					bp._id === a.payload._id ? a.payload : bp
				),
			};
		case 'DELETE_BREAKPOINT':
			return {
				...s,
				isSynchronizedWithBackend: false,
				breakpoints: s.breakpoints.filter((bp) => bp._id !== a.payload),
			};

		case 'SYNC_REQUEST_INITIALIZED':
			return {
				...s,
				requestPending: true,
			};

		case 'BREAKPOINT_SYNC_SUCCESS':
			return {
				...s,
				requestPending: false,
				isSynchronizedWithBackend: true,
				snackbarStatus: 'success',
				breakpoints: a.payload,
				hasUpdated: true,
			};

		case 'BREAKPOINT_SYNC_FAILED':
			return {
				...s,
				requestPending: false,
				isSynchronizedWithBackend: false,
				error: a.payload,
				snackbarStatus: 'error',
			};
		case 'UNSAVED_CLOSE_ATTEMPT':
			return {
				...s,
				snackbarStatus: 'attemptedClose',
			};

		case 'DELETE_ATTEMPT':
			return {
				...s,
				snackbarStatus: 'attemptedDelete',
			};
		case 'RESET_ERROR':
			return {
				...s,
				snackbarStatus: 'none' as const,
				error: none,
			};
		case 'RESET_STATUS':
			return {
				...s,
				snackbarStatus: 'none' as const,
			};
		case 'ADD_ERROR':
			return {
				...s,
				error: some(a.payload),
				snackbarStatus: 'error',
			};
		default:
			return s;
	}
};
