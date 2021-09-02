import { IUserFacingProfileProps } from '.';
import {
	IUserProfilePreferences,
	TAuthorizedUserResponse,
} from 'sharedTypes/User';
import { bytesToHumanReadableSize } from '../Uploader/useCases/preProcessSelectedFiles/appendMetadata';

export const extractViewableProps = (
	user: TAuthorizedUserResponse
): IUserFacingProfileProps => {
	const prefs = user.userPreferences;

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
			: fallBacks.preferredDisplayName,
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
