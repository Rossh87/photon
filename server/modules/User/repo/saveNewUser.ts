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

// need better name here
const prepNewUserForSave = (u: IUser) =>
	Object.assign({}, u, {
		registeredDomains: [],
		imageCount: 0,
		uploadUsage: 0,
	});

export const _saveNewUser = reverseTwo(saveNewUser);
