import apiRoot from '../../../core/apiRoot';

export const REQUEST_USER_IMG_DATA_ENDPOINT = `${apiRoot}/upload/retrieve`;

export const SYNC_BREAKPOINT_ENDPOINT = `${apiRoot}/upload/syncbreakpoints`;

export const DELETE_UPLOAD_ENDPOINT = (id: string) => `${apiRoot}/upload/${id}`;
