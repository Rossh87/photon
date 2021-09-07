import { IClientUpload, TUploadDeletionID } from 'sharedTypes/Upload';
import { TSavedBreakpoints } from 'sharedTypes/Breakpoint';
import { BaseError } from '../../../core/error';

export type TTabPanelType = 'breakpoint' | 'code';

export interface IImageSearchState {
	imageMetadata: IClientUpload[];
	currentlyActiveImages: IClientUpload[];
	error: BaseError | null;
	imageUnderConfiguration: TimageUnderConfigurationState;
}

export interface IBreakpointUpdateTransferObject {
	imageID: string;
	breakpoints: TSavedBreakpoints;
}

interface IFetchImageDataAction {
	type: 'FETCH_IMG_DATA';
}

interface IDeleteImageAction {
	type: 'DELETE_IMAGE';
	payload: TUploadDeletionID;
}

export type TimageUnderConfigurationState = null | IClientUpload;

// NB the received array CAN BE EMPTY if the user has not uploaded anything yet.  This
// should not trigger an error state.
interface IImageDataReceivedAction {
	type: 'IMG_DATA_RECEIVED';
	payload: IClientUpload[];
}

export interface ISearchedImagesEmittedAction {
	type: 'SEARCHED_IMAGES_EMITTED';
	payload: IClientUpload[];
}

interface IImageSearchErrorAction {
	type: 'IMG_SEARCH_ERR';
	payload: BaseError;
}

export interface ISearchData {
	searchTerm: string;
	imgData: IClientUpload[];
}

export interface IInitImageSearchAction {
	type: 'INIT_IMG_SEARCH';
	payload: ISearchData;
}

export interface IResetSearchAction {
	type: 'RESET_SEARCH';
}

export interface ISetImageUnderConfigurationAction {
	type: 'SET_IMG_UNDER_CONFIGURATION';
	payload: IClientUpload;
}
export interface ICloseImageUnderConfiguration {
	type: 'CLOSE_IMG_UNDER_CONFIGURATION';
	payload?: IBreakpointUpdateTransferObject;
}

export type TImageSearchActions =
	| IDeleteImageAction
	| IFetchImageDataAction
	| IImageDataReceivedAction
	| ISearchedImagesEmittedAction
	| IImageSearchErrorAction
	| IInitImageSearchAction
	| IResetSearchAction
	| ISetImageUnderConfigurationAction
	| ICloseImageUnderConfiguration;
