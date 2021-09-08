import {
	IUserProfilePreferences,
	IUserProfilePreferencesTransportObject,
	TAuthorizedUserResponse,
} from 'sharedTypes/User';
import { bytesToHumanReadableSize } from '../Uploader/useCases/preProcessSelectedFiles/appendMetadata';
import {
	IUserFacingProfileProps,
	TConfigurableProfileProps,
} from './sharedProfileTypes';

export const extractViewableProps = (
	user: TAuthorizedUserResponse
): IUserFacingProfileProps => {
	const prefs = user.userPreferences;

	// NB: if thumbnail URL is undefined, we convert it to empty string
	// so it will still show up as an editable field in the UI.
	// It gets converted BACK to undefined if it's empty whenever
	// we save user preferences.
	const fallBacks: Required<IUserProfilePreferences> = {
		preferredEmail: user.OAuthEmail,
		preferredDisplayName: user.displayName,
		preferredThumbnailURL: user.thumbnailURL ? user.thumbnailURL : '',
	};

	return {
		userName: prefs?.preferredDisplayName
			? prefs.preferredDisplayName
			: fallBacks.preferredDisplayName,
		emailAddress: prefs?.preferredEmail
			? prefs.preferredEmail
			: fallBacks.preferredEmail,
		profileImage: prefs?.preferredThumbnailURL
			? prefs.preferredThumbnailURL
			: fallBacks.preferredThumbnailURL,
		uniqueUploads: user.imageCount,
		accessLevel: user.accessLevel,
		uploadUsage: bytesToHumanReadableSize(user.uploadUsage),
	};
};

export enum MapPropsToHumanLabels {
	userName = 'Username',
	emailAddress = 'Preferred Email',
	profileImage = 'Profile Image URL',
	uniqueUploads = 'Unique Uploads',
	accessLevel = 'Access Level',
	uploadUsage = 'Total Upload Usage',
}

// TODO: this is pretty janky, going back and forth between empty string
// and undefined...
export const userFacingPropsToPreferences = (
	ufp: IUserFacingProfileProps
): IUserProfilePreferencesTransportObject => ({
	preferredDisplayName: ufp.userName,
	preferredEmail: ufp.emailAddress,
	preferredThumbnailURL:
		ufp.profileImage.length > 0 ? ufp.profileImage : undefined,
});

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

interface IValidationTools {
	failureMessage: string;
	pattern: RegExp;
}

export const validationTools: Record<
	keyof TConfigurableProfileProps,
	IValidationTools
> = {
	emailAddress: {
		failureMessage: 'Please enter a valid email',
		pattern: emailPattern,
	},
	profileImage: {
		failureMessage: 'Please enter a valid URL',
		pattern: urlPattern,
	},
	userName: {
		failureMessage:
			"Username must consist of between 5 and 30 alphanumeric characters, or '-' or '.'",
		pattern: displayNamePattern,
	},
};

export const isConfigurableField = (
	s: string
): s is keyof TConfigurableProfileProps =>
	s === 'emailAddress' || s === 'profileImage' || s === 'userName';
