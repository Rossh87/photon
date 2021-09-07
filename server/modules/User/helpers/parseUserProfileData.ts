import * as t from 'io-ts';
import {
	IUserProfilePreferences,
	IUserProfilePreferencesTransportObject,
} from '../../../../sharedTypes/User';
import { withMessage } from 'io-ts-types';

// export interface IUserProfilePreferences {
// preferredEmail?: string;
// preferredThumbnailURL?: string;
// preferredDisplayName?: string;
// }
//

const brandString = <
	N extends string,
	Brand extends { readonly [K in N]: symbol }
>(
	pattern: RegExp,
	name: N
) =>
	t.brand(
		t.string,
		(s: string): s is t.Branded<string, Brand> => pattern.test(s),
		name
	);

const emailPattern =
	/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const urlPattern =
	/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

/**
 * Allows:
 * - alphanumeric chars (lower and upper)
 * - number
 * - dots
 * - underscores
 * - from 5 to 30 chars (inclusive at both ends)
 */
const displayNamePattern = /^[A-Za-z0-9\-\.]{5,30}$/;

// err message *BEFORE* the colon is a hint to the field with which the failure corresponds.
// Client can use this to assign the error to the appropriate field and extract the message:
// preferredEmail?: string;
// 	preferredThumbnailURL?: string;
// 	preferredDisplayName?: string;
const EmailAddress = withMessage(
	brandString(emailPattern, 'EmailAddress'),
	(e) => 'preferredEmail: Please enter a valid email address'
);

const URL = withMessage(
	brandString(urlPattern, 'URL'),
	(e) => 'preferredThumbnailURL: Photo URL must be a valid URL'
);

const DisplayName = withMessage(
	brandString(displayNamePattern, 'DisplayName'),
	(e) =>
		'preferredDisplayName: Username must be an alphanumeric string or "-" or "." between 5 and 30 characters'
);

export const partialPreferenceProperties = t.partial({
	preferredEmail: EmailAddress,
	preferredThumbnailURL: URL,
	preferredDisplayName: DisplayName,
});

export const userPreferenceProperties = t.type({
	preferences: partialPreferenceProperties,
	ownerID: t.string,
});

export type UserPreferenceProperties = t.TypeOf<
	typeof userPreferenceProperties
>;

export const parseUserProfileData = (
	a: IUserProfilePreferencesTransportObject,
	id: string
) => userPreferenceProperties.decode({ preferences: a, ownerID: id });
