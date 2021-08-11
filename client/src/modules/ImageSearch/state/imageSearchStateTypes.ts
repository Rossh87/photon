import { IDBUpload } from 'sharedTypes/Upload';
import { BaseError } from '../../../core/error';

export interface IImageSearchState {
    imageMetadata: IDBUpload[];
    currentlyActiveImages: IDBUpload[];
    error: BaseError | null;
}

interface IFetchImageDataAction {
    type: 'FETCH_IMG_DATA';
}

// NB the received array CAN BE EMPTY if the user has not uploaded anything yet.  This
// should not trigger an error state.
interface IImageDataReceivedAction {
    type: 'IMG_DATA_RECEIVED';
    payload: IDBUpload[];
}

export interface ISearchedImagesEmittedAction {
    type: 'SEARCHED_IMAGES_EMITTED';
    payload: IDBUpload[];
}

interface IImageSearchErrorAction {
    type: 'IMG_SEARCH_ERR';
    payload: BaseError;
}

export interface ISearchData {
    searchTerm: string;
    imgData: IDBUpload[];
}

export interface IInitImageSearchAction {
    type: 'INIT_IMG_SEARCH';
    payload: ISearchData;
}

export interface IResetSearchAction {
    type: 'RESET_SEARCH';
}

export type TImageSearchActions =
    | IFetchImageDataAction
    | IImageDataReceivedAction
    | ISearchedImagesEmittedAction
    | IImageSearchErrorAction
    | IInitImageSearchAction
    | IResetSearchAction;
