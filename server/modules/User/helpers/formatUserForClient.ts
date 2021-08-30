import { TDBUser, TAuthorizedUserResponse } from 'sharedTypes/User';

export const formatUserForClient = (u: TDBUser): TAuthorizedUserResponse => ({
	...u,
	_id: u._id.toHexString(),
});
