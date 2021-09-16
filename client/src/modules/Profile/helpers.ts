import {
	IUserProfilePreferences,
	IUserProfilePreferencesTransportObject,
	TAuthorizedUserResponse,
} from 'sharedTypes/User';
import { formatJoinDate } from '../../core/date';
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
		preferredEmail: user.registeredEmail,
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
		joined: formatJoinDate(user.createdAt),
	};
};

export enum MapPropsToHumanLabels {
	userName = 'Username',
	emailAddress = 'Preferred Email',
	profileImage = 'Profile Image URL',
	uniqueUploads = 'Unique Uploads',
	accessLevel = 'Access Level',
	uploadUsage = 'Total Upload Usage',
	joined = 'Joined',
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

export const isConfigurableField = (
	s: string
): s is keyof TConfigurableProfileProps =>
	s === 'emailAddress' || s === 'profileImage' || s === 'userName';
