import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import apiRoot from './core/apiRoot';

/**NOTE: these partial URLs should NEVER end with a trailing slash.
 * It is the caller's responsibility to use the correct path separator
 * when appending a suffix.
 */
export const AUTH_API_ENDPOINT = `${apiRoot}/auth/user`;
export const GOOGLE_OAUTH_ENDPOINT = `${apiRoot}/connect/google`;
export const GITHUB_OAUTH_ENDPOINT = `${apiRoot}/connect/github`;
export const REQUEST_UPLOAD_URI_ENDPOINT = `${apiRoot}/upload/request`;
export const REQUEST_USER_IMG_DATA_ENDPOINT = `${apiRoot}/upload/retrieve`;
export const MAX_RAW_FILE_SIZE_IN_BYTES = 1.049e6;
export const UPLOAD_WIDTH_VALUES = [250, 750, 1200, 2000];
export const UPLOAD_WIDTHS: NonEmptyArray<
	'tiny' | 'small' | 'medium' | 'large'
> = ['tiny', 'small', 'medium', 'large'];
export const IMAGE_UPLOAD_QUALITY = 0.75;
export const DEFAULT_APP_MESSAGE_TIMEOUT = 3000;
