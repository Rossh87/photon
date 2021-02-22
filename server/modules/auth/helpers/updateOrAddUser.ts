import { IUser, _getUpdatedUser, getUserOAuthID } from '../../User';
import * as TE from 'fp-ts/lib/TaskEither';
import { MongoClient } from 'mongodb';
import { DBError } from '../../../core/repo';
import { pipe } from 'fp-ts/lib/function';
import { _getUserByID } from '../../User/repo/getUserByID';
import { saveNewUser, TSaveNewUserResult } from '../../User/repo/saveNewUser';
import { _saveUpdatedUser } from '../../User/repo/saveUpdatedUser';
import { flow } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';

export type TUpdateOrAddUserResult = TE.TaskEither<DBError, IUser>;

interface IUpdateOrAddUser {
    (resUser: IUser): (repoClient: MongoClient) => TUpdateOrAddUserResult;
}

interface IHandleUserUpdate {
    (incomingUser: IUser): (
        repoClient: MongoClient
    ) => (maybeDBUsr: O.Option<IUser>) => TUpdateOrAddUserResult;
}

export const updateOrAddUser: IUpdateOrAddUser = (resUser) => (repoClient) =>
    pipe(
        resUser,
        getUserOAuthID,
        _getUserByID(repoClient),
        TE.chain(handleUserUpdate(resUser)(repoClient))
    );

const handleUserUpdate: IHandleUserUpdate = (incomingUser) => (repoClient) => (
    maybeDBUsr
) =>
    pipe(
        maybeDBUsr,
        O.fold(
            // if incoming auth request is from user not currently in database, save them as
            // a new user and return the saved data
            () => saveNewUser(incomingUser)(repoClient),
            // otherwise, check to see if user info is up-to-date
            flow(
                _getUpdatedUser(incomingUser),
                E.fold(
                    // if no updates needed, simply return the incoming data to
                    // populate our session user
                    (dbUsr) => TE.of<never, IUser>(dbUsr),
                    // otherwise, make database updates and return the fresh user
                    _saveUpdatedUser(repoClient)
                )
            )
        )
    );
