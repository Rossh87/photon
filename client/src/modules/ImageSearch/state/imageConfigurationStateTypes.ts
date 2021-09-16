import { BaseError } from '../../../core/error';
import {
	ISavedBreakpoint,
} from 'sharedTypes/Breakpoint';
import { Option } from 'fp-ts/Option';
import { IClientUpload } from 'sharedTypes/Upload';

type TBreakPointUIKinds = 'user' | 'default';

// convert number props to string for use in HTML inputs
export type TBreakpointUI = Omit<
	ISavedBreakpoint,
	'mediaWidth' | 'slotWidth'
> & {
	origin: TBreakPointUIKinds;
	editing: boolean;
	mediaWidth: string;
	slotWidth: string;
};

export type TDefaultBreakpointUI = TBreakpointUI & {
	origin: 'default';
};

export type TUserBreakpointUI = TBreakpointUI & {
	origin: 'user';
};

export type TNewBreakpointUI = TBreakpointUI & {
	origin: 'new';
};

export type TUIBreakpoints = TBreakpointUI[];

// This is for components taking breakpoint values from inputs,
// whose values are always a string
// export interface ILocalBreakpointUI {
// 	queryType: TBreakpointQueryType;
// 	mediaWidth: string;
// 	slotWidth: string;
// 	slotUnit: TSavedBreakpointslotUnit;
// 	_id: string;
// 	origin: TBreakPointUIKinds;
// 	editing: boolean;
// }

export interface IImageConfigurationProps {
	isSynchronizedWithBackend: boolean;
	error: Option<BaseError>;
	requestPending: boolean;
	hasUpdated: boolean;
	open: boolean;
}

export type IConfigurableImage = IImageConfigurationProps & IClientUpload;

export type IImageConfigurationState = IConfigurableImage;

// dispatch regular breakpoints, and convert them in a handler
interface SetImageUnderConfiguration {
	type: 'IMAGE_CONFIG/SET_IMAGE_UNDER_CONFIGURATION';
	payload: IConfigurableImage;
}

interface CreateNewBreakpointAction {
	type: 'IMAGE_CONFIG/CREATE_NEW_BREAKPOINT';
}

interface UpdateOneBreakpointAction {
	type: 'IMAGE_CONFIG/UPDATE_ONE_BREAKPOINT';
	payload: ISavedBreakpoint;
}

interface DeleteBreakpointAction {
	type: 'IMAGE_CONFIG/DELETE_BREAKPOINT';
	payload: string;
}

interface InitSyncRequestAction {
	type: 'IMAGE_CONFIG/SYNC_REQUEST_INITIALIZED';
}

export interface SyncSuccessAction {
	type: 'IMAGE_CONFIG/BREAKPOINT_SYNC_SUCCESS';
	payload: { imageID: string; breakpoints: ISavedBreakpoint[] };
}

interface SyncFailedAction {
	type: 'IMAGE_CONFIG/BREAKPOINT_SYNC_FAILED';
	payload: Option<BaseError>;
}

interface CloseImageUnderConfigAction {
	type: 'IMAGE_CONFIG/CLOSE_IMAGE_UNDER_CONFIGURATION';
}

export type TImageConfigurationActions =
	| CloseImageUnderConfigAction
	| SetImageUnderConfiguration
	| SyncSuccessAction
	| SyncFailedAction
	| InitSyncRequestAction
	| DeleteBreakpointAction
	| CreateNewBreakpointAction
	| UpdateOneBreakpointAction;
