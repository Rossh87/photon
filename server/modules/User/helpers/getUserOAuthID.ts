import { IUserProfileProperties, TDBUser } from 'sharedTypes/User';

export const getUserOAuthID = (u: IUserProfileProperties | TDBUser) =>
	u.OAuthProviderID;
