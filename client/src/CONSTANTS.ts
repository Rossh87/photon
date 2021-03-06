import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

/**NOTE: these partial URLs should NEVER end with a trailing slash.
 * It is the caller's responsibility to use the correct path separator
 * when appending a suffix.
 */
export const AUTH_API_ENDPOINT = 'http://localhost:8000/auth/user';
export const GOOGLE_OAUTH_ENDPOINT = 'http://localhost:8000/connect/google';
export const REQUEST_UPLOAD_URI_ENDPOINT =
	'http://localhost:8000/upload/request';
export const REQUEST_USER_IMG_DATA_ENDPOINT =
	'http://localhost:8000/upload/retrieve';
export const MAX_RAW_FILE_SIZE_IN_BYTES = 1.049e6;
export const BASE_IMAGE_UPLOAD_PATH = 'https://somePath/userImages';
export const UPLOAD_WIDTH_VALUES = [250, 750, 1200, 2000];
export const UPLOAD_WIDTHS: NonEmptyArray<
	'tiny' | 'small' | 'medium' | 'large'
> = ['tiny', 'small', 'medium', 'large'];
export const IMAGE_UPLOAD_QUALITY = 0.75;
