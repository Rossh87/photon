import { IUser } from '..';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import { MongoClient, ObjectQuerySelector, Collection } from 'mongodb';
import { getCollection, DBReadError } from '../../../core/repo';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import { reverseTwo } from '../../../core/utils/reverseCurried';

export type TGetUserByIDResult = TE.TaskEither<DBReadError, O.Option<IUser>>;

export const getUserByID: (
    id: string
) => (
    repoClient: MongoClient
) => TE.TaskEither<DBReadError, O.Option<IUser>> = (id) => (repoClient) =>
    pipe(repoClient, getCollection<IUser>('users'), findUser(id));

const findUser: (id: string) => (c: Collection<IUser>) => TGetUserByIDResult = (
    id
) => (c) =>
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
export const _getUserByID = reverseTwo(getUserByID);
