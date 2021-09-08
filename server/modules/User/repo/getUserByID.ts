import { TDBUser, IUserProfileProperties } from 'sharedTypes/User';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import { MongoClient, Collection } from 'mongodb';
import { getCollection, DBReadError } from '../../../core/repo';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { reverseTwo } from '../../../core/utils/reverseCurried';

export type TGetUserByIDResult = TE.TaskEither<DBReadError, O.Option<TDBUser>>;

export const getUserByOAuthID: (
	id: string
) => (
	repoClient: MongoClient
) => TE.TaskEither<DBReadError, O.Option<TDBUser>> = (id) => (repoClient) =>
	pipe(repoClient, getCollection<TDBUser>('users'), findUser(id));

const findUser: (id: string) => (c: Collection<TDBUser>) => TGetUserByIDResult =
	(id) => (c) =>
		TE.tryCatch(
			() =>
				c
					.findOne({ OAuthProviderID: id })
					.then((usr) => (usr ? O.some(usr) : O.none)),
			(reason) =>
				DBReadError.create(
					c.collectionName,
					{ OAuthProviderID: id },
					reason
				)
		);

// export with args reversed for convenience
export const _getUserByOAuthID = reverseTwo(getUserByOAuthID);
