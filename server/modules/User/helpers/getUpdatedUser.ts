import { IUserProfileProperties, TDBUser } from 'sharedTypes/User';

// replace profile properties with whatever comes in from OAuth provider,
// keep any preferences user has set in our app, and be sure to keep
// usage data that has accumulated.
export const getUpdatedUser =
	(incomingUser: IUserProfileProperties) =>
	(dbUser: TDBUser): TDBUser => ({
		...incomingUser,
		userPreferences: dbUser.userPreferences,
		uploadUsage: dbUser.uploadUsage,
		imageCount: dbUser.imageCount,
		registeredDomains: dbUser.registeredDomains,
		accessLevel: dbUser.accessLevel,
		_id: dbUser._id,
	});
