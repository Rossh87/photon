import { IClientUpload, TUploadDeletionID } from 'sharedTypes/Upload';
import { TSavedBreakpoints } from 'sharedTypes/Breakpoint';
import { BaseError } from '../../../core/error';

export type TTabPanelType = 'breakpoint' | 'code';

export interface ISearchData {
	searchTerm: string;
	imgData: IClientUpload[];
}

export interface IImageSearchState {
	imageMetadata: IClientUpload[];
	currentlyActiveImages: IClientUpload[];
}

export interface IBreakpointUpdateTransferObject {
	imageID: string;
	breakpoints: TSavedBreakpoints;
}

interface IFetchImageDataAction {
	type: 'IMAGES/FETCH_IMG_DATA';
}

export interface IDeleteImageAction {
	type: 'IMAGES/DELETE_IMAGE';
	payload: TUploadDeletionID;
}

// NB the received array CAN BE EMPTY if the user has not uploaded anything yet.  This
// should not trigger an error state.
interface IImageDataReceivedAction {
	type: 'IMAGES/IMG_DATA_RECEIVED';
	payload: IClientUpload[];
}

export interface ISearchedImagesEmittedAction {
	type: 'IMAGES/SEARCHED_IMAGES_EMITTED';
	payload: IClientUpload[];
}

interface IImageSearchErrorAction {
	type: 'IMAGES/IMG_SEARCH_ERR';
	payload: BaseError;
}

export interface IInitImageSearchAction {
	type: 'IMAGES/INIT_IMG_SEARCH';
	payload: ISearchData;
}

export interface IResetSearchAction {
	type: 'IMAGES/RESET_SEARCH';
}

export type TImageSearchActions =
	| IDeleteImageAction
	| IFetchImageDataAction
	| IImageDataReceivedAction
	| ISearchedImagesEmittedAction
	| IImageSearchErrorAction
	| IInitImageSearchAction
	| IResetSearchAction;
