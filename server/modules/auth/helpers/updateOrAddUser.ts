import { IUserProfileProperties, TDBUser } from 'sharedTypes/User';
import { getUserOAuthID, _getUpdatedUser } from '../../User';
import * as TE from 'fp-ts/lib/TaskEither';
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';
import { MongoClient } from 'mongodb';
import { DBError } from '../../../core/repo';
import { pipe } from 'fp-ts/lib/function';
import { _getUserByOAuthID } from '../../User/repo/getUserByID';
import { saveNewUser } from '../../User/repo/saveNewUser';
import { _saveUpdatedUser } from '../../User/repo/saveUpdatedUser';
import { flow } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { IAsyncDeps } from '../../../core/asyncDeps';

export type TUpdateOrAddUserResult = TE.TaskEither<
	DBError,
	IUserProfileProperties | TDBUser
>;

export const updateOrAddUser =
	(
		resUser: IUserProfileProperties
	): ReaderTaskEither<
		IAsyncDeps,
		DBError,
		IUserProfileProperties | TDBUser
	> =>
	(asyncDeps) =>
		pipe(
			resUser,
			getUserOAuthID,
			_getUserByOAuthID(asyncDeps.repoClient),
			TE.chain(handleUserUpdate(resUser)(asyncDeps.repoClient))
		);

const handleUserUpdate =
	(incomingUser: IUserProfileProperties) =>
	(repoClient: MongoClient) =>
	(maybeDBUsr: O.Option<TDBUser>) =>
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
						(dbUsr) => TE.of<never, TDBUser>(dbUsr),
						// otherwise, make database updates and return the fresh user
						_saveUpdatedUser(repoClient)
					)
				)
			)
		);
