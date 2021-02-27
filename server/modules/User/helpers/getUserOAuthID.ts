import { IUser, IDBUser } from '../sharedUserTypes';

export const getUserOAuthID = (u: IUser | IDBUser) => u.OAuthProviderID;
