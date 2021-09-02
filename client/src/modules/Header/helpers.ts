import { pipe } from 'fp-ts/lib/function';
import { fromNullable, map, alt } from 'fp-ts/lib/Option';
import { TAuthorizedUserResponse } from '../../../../sharedTypes/User';

// First look in preferences property; if nothing there,
// use the OAuth provider URL; if nothing there, return a
// response that signals "empty".
export const getProfileURL = (profileData: TAuthorizedUserResponse) =>
	pipe(
		profileData.userPreferences?.preferredThumbnailURL,
		fromNullable,
		alt(() => pipe(profileData.thumbnailURL, fromNullable))
	);
