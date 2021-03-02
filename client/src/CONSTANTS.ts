import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export const AUTH_API_ENDPOINT = 'http://localhost:8000/auth/user';
export const GOOGLE_OAUTH_ENDPOINT = 'http://localhost:8000/connect/google';
export const MAX_RAW_FILE_SIZE_IN_BYTES = 1.049e6;
export const BASE_IMAGE_UPLOAD_PATH = 'https://somePath/userImages';
export enum UPLOAD_WIDTHS_ENUM {
    'tiny' = 250,
    'small' = 750,
    'medium' = 1200,
    'large' = 2000,
}
export const UPLOAD_WIDTHS: NonEmptyArray<string> = [
    'tiny',
    'small',
    'medium',
    'large',
];
