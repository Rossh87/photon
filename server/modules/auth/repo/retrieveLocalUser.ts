import { flow, pipe } from 'fp-ts/lib/function';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { TLocalUserCredentials } from '../sharedAuthTypes';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { DBReadError, getCollection } from '../../../core/repo';
import { TDBUser } from '../../../../sharedTypes/User';
import { tryFindOne } from '../../../core/repo';
import { BaseError, HTTPErrorTypes } from '../../../core/error';

export const retrieveLocalUser =
	(req: TLocalUserCredentials) => (deps: IAsyncDeps) =>
		pipe(
			deps.repoClient,
			getCollection<TDBUser>('users'),
			tryFindOne<TDBUser>({
				registeredEmail: req.registeredEmailAddress,
				identityProvider: 'local',
			})(),
			TE.chain(
				flow(
					O.fromNullable,
					TE.fromOption(
						() =>
							new BaseError(
								`No account exists for requested email address: ${req.registeredEmailAddress}`,
								HTTPErrorTypes.UNAUTHORIZED
							)
					)
				)
			)
		);
