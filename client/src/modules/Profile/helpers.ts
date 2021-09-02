import { IUserFacingProfileProps } from '.';
import {
	IUserProfilePreferences,
	IUserProfilePreferencesTransportObject,
	TAuthorizedUserResponse,
} from 'sharedTypes/User';
import { bytesToHumanReadableSize } from '../Uploader/useCases/preProcessSelectedFiles/appendMetadata';

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
