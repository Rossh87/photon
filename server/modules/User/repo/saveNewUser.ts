import { IUser, IDBUser } from '../sharedUserTypes';
import {
	MongoClient,
	ObjectQuerySelector,
	Collection,
	OptionalId,
	WithId,
} from 'mongodb';
import { getCollection, DBWriteError, trySaveOne } from '../../../core/repo';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { reverseTwo } from '../../../core/utils/reverseCurried';

export type TSaveNewUserResult = TE.TaskEither<DBWriteError, IDBUser>;

// we return the saved user in case we want to send to client or some such
export const saveNewUser = (newUser: IUser) => (repoClient: MongoClient) =>
	pipe(
		repoClient,
		getCollection('users'),
		pipe(newUser, prepNewUserForSave, trySaveOne)
	);

// add app-specific properties to user object here.
const prepNewUserForSave = (u: IUser): Omit<IDBUser, '_id'> =>
	Object.assign({}, u, {
		registeredDomains: [],
		imageCount: 0,
		uploadUsage: 0,
		accessLevel: 'demo' as const,
	});

export const _saveNewUser = reverseTwo(saveNewUser);
