import { TDBUser, TSessionUser } from '../../../sharedTypes/User';

// all this does is convert the _id property from ObjectId to its string representation.
// this is needed in tests where we want to assign IDs ourself
export const toSessionUser = (u: TDBUser): TSessionUser => ({
	...u,
	_id: u._id.toHexString(),
});
