import { IUserProfileProperties, TDBUser } from 'sharedTypes/User';
import { getUpdatedUser } from '../../User/helpers/getUpdatedUser';
import { getUserOAuthID } from '../../User/helpers/getUserOAuthID';
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
				// otherwise, resave user with current properties
				flow(getUpdatedUser(incomingUser), _saveUpdatedUser(repoClient))
			)
		);
