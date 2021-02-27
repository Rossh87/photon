import { DBUser, IUser } from '..';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import { MongoClient, ObjectQuerySelector, Collection } from 'mongodb';
import { getCollection, DBReadError } from '../../../core/repo';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import { reverseTwo } from '../../../core/utils/reverseCurried';

export type TGetUserByIDResult = TE.TaskEither<DBReadError, O.Option<DBUser>>;

export const getUserByOAuthID: (
    id: string
) => (
    repoClient: MongoClient
) => TE.TaskEither<DBReadError, O.Option<DBUser>> = (id) => (repoClient) =>
    pipe(repoClient, getCollection<DBUser>('users'), findUser(id));

const findUser: (
    id: string
) => (c: Collection<DBUser>) => TGetUserByIDResult = (id) => (c) =>
    TE.tryCatch(
        () =>
            c
                .findOne({ OAuthProviderID: id })
                .then((usr) => (usr ? O.some(usr) : O.none)),
        (reason) =>
            DBReadError.create<IUser>(
                c.collectionName,
                { OAuthProviderID: id },
                reason
            )
    );

// export with args reversed for convenience
export const _getUserByOAuthID = reverseTwo(getUserByOAuthID);
