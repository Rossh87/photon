import { IUser } from '../../auth/AuthManager/authTypes';

export const mockUser: IUser = {
	OAuthProviderName: 'google',
	_id: '1234',
	thumbnailURL: 'someImg@domain.com',
	displayName: 'userGuy',
	familyName: 'tibbers',
	givenName: 'tom',
	emailAddress: 'tom@tom.com',
};
