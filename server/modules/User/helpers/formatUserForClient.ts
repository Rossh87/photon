import { ObjectId } from 'mongodb';
import {
	TDBUser,
	TAuthorizedUserResponse,
	TSessionUser,
} from 'sharedTypes/User';

export const formatUserForClient = (
	u: TSessionUser
): TAuthorizedUserResponse => ({
	...u,
	createdAt: new ObjectId(u._id).getTimestamp().toJSON(),
});
