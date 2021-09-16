import { TDBUser } from 'sharedTypes/User';
import { Collection } from 'mongodb';
import { getCollection, DBReadError } from '../../../core/repo';
import * as TE from 'fp-ts/lib/TaskEither';
import { flow, pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { EmailAddress } from '../../User/helpers/parseUserPreferences';
import * as t from 'io-ts';
import * as RTE from 'fp-ts/ReaderTaskEither';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { TLocalUserCredentials } from '../sharedAuthTypes';
import { InvalidSignupError } from '../domain/InvalidSignupError';

type Email = t.TypeOf<typeof EmailAddress>;

const findDuplicateEmails =
	(req: TLocalUserCredentials) => (c: Collection<TDBUser>) =>
		pipe(
			TE.tryCatch(
				() =>
					c.findOne({ registeredEmail: req.registeredEmailAddress }),
				(reason) =>
					DBReadError.create(
						c.collectionName,
						{ registeredEmail: req.registeredEmailAddress },
						reason
					)
			),
			TE.chainW(
				// left if value is NOT null
				TE.fromPredicate(
					(found) => found === null,
					() =>
						InvalidSignupError.create(
							'attempt to signup new user with an email address that has already been registered',
							'Email already in use',
							null
						)
				)
			)
		);

export const emailIsAvailable = flow(
	findDuplicateEmails,
	RTE.local<IAsyncDeps, Collection<TDBUser>>((d) =>
		getCollection<TDBUser>('users')(d.repoClient)
	)
);
