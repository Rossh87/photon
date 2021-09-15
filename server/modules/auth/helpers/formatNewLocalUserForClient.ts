import { TAuthorizedUserResponse, TDBUser } from '../../../../sharedTypes/User';

export const formatNewLocalUserForClient = (
	newUser: TDBUser
): TAuthorizedUserResponse => {
	const userResponse = {
		...newUser,
		_id: newUser._id.toHexString(),
		createdAt: newUser._id.getTimestamp().toJSON(),
	};
	// remove password property from new user
	delete userResponse.passwordHash;
	return userResponse;
};
