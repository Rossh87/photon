import { IDBUser, IAuthorizedUserResponse } from '../sharedUserTypes';
import { WithId } from 'mongodb';

export const formatUserForClient: (
	u: WithId<IDBUser>
) => IAuthorizedUserResponse = (u) => {
	const chosenKeys: Array<keyof IDBUser> = [
		'OAuthProviderName',
		'thumbnailURL',
		'displayName',
		'familyName',
		'givenName',
	];

	const response: IAuthorizedUserResponse = chosenKeys.reduce<IAuthorizedUserResponse>(
		(res, key) => {
			res[key] = u[key];
			return res;
		},
		{} as IAuthorizedUserResponse
	);

	// need to set emailAddress from preferredEmail or OAuthEmail b/c
	// name of these props changes from client side to server side type
	const email = u.preferredEmail ? u.preferredEmail : u.OAuthEmail;
	response.emailAddress = email;

	// stringify user's object ID for client use
	const _id = u._id.toHexString();
	response._id = _id;

	return response;
};
