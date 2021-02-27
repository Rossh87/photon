import { IUser } from '../sharedUserTypes';
import { MongoClient, ObjectQuerySelector, Collection } from 'mongodb';
import { getCollection, DBWriteError, trySaveOne } from '../../../core/repo';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { reverseTwo } from '../../../core/utils/reverseCurried';

export type TSaveNewUserResult = TE.TaskEither<DBWriteError, IUser>;

// we return the saved user in case we want to send to client or some such
export const saveNewUser = (newUser: IUser) => (repoClient: MongoClient) =>
    pipe(repoClient, getCollection<IUser>('users'), trySaveOne(newUser));

export const _saveNewUser = reverseTwo(saveNewUser);
