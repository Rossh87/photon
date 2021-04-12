import { IDBUser, IUser } from '../sharedUserTypes';
import { MongoClient, FilterQuery, UpdateQuery } from 'mongodb';
import { getCollection, DBError, tryUpdateOne } from '../../../core/repo';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { reverseTwo } from '../../../core/utils/reverseCurried';

export type TUpdateUserResult = TE.TaskEither<DBError, IDBUser>;

// we return the saved user in case we want to send to client or some such
export const saveUpdatedUser = (updatedUser: IDBUser) => (
	repoClient: MongoClient
) =>
	pipe(
		repoClient,
		getCollection<IDBUser>('users'),
		tryUpdateOne(getUserFilter(updatedUser))(
			getUpdateUserQuery(updatedUser)
		),
		TE.map(() => updatedUser)
	);

export const _saveUpdatedUser = reverseTwo(saveUpdatedUser);

// TODO: it may be helpful to abstract these types to reusable types--unclear as of yet
const getUserFilter: (updatedUser: IDBUser) => FilterQuery<IDBUser> = (
	updatedUser
) => ({
	OAuthProviderID: updatedUser.OAuthProviderID,
	OAuthProviderName: updatedUser.OAuthProviderName,
});

const getUpdateUserQuery: (updatedUser: IDBUser) => UpdateQuery<IDBUser> = (
	updatedUser
) => ({
	$set: updatedUser,
});
