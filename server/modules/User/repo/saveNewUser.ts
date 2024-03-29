import { IUserProfileProperties, TUser } from 'sharedTypes/User';
import { MongoClient } from 'mongodb';
import { getCollection, DBWriteError, trySaveOne } from '../../../core/repo';
import { pipe } from 'fp-ts/lib/function';
import { reverseTwo } from '../../../core/utils/reverseCurried';

// we return the saved user in case we want to send to client or some such
export const saveNewUser =
	(newUser: IUserProfileProperties) => (repoClient: MongoClient) =>
		pipe(
			repoClient,
			getCollection('users'),
			pipe(newUser, prepNewUserForSave, trySaveOne)
		);

// add app-specific properties to user object here.
export const prepNewUserForSave = (u: IUserProfileProperties): TUser =>
	Object.assign({}, u, {
		registeredDomains: [],
		imageCount: 0,
		uploadUsage: 0,
		accessLevel: 'demo' as const,
	});

export const _saveNewUser = reverseTwo(saveNewUser);
