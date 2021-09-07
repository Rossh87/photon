export const REQUEST_USER_IMG_DATA_ENDPOINT =
	'http://localhost:8000/upload/retrieve';

export const SYNC_BREAKPOINT_ENDPOINT =
	'http://localhost:8000/upload/syncbreakpoints';

export const DELETE_UPLOAD_ENDPOINT = (id: string) =>
	`http://localhost:8000/upload/${id}`;
