import { identity, pipe } from 'fp-ts/lib/function';
import { TDBUser } from '../../../../sharedTypes/User';
import { TLocalUserCredentials } from '../sharedAuthTypes';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as E from 'fp-ts/Either';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import bcrypt from 'bcrypt';

export const comparePasswordHashes =
	(foundUsr: TDBUser) => (credentials: TLocalUserCredentials) =>
		pipe(
			foundUsr.passwordHash,
			O.fromNullable,
			TE.fromOption(
				() =>
					new BaseError(
						`password hash inexplicably missing from ${credentials.registeredEmailAddress}'s profile data`,
						HTTPErrorTypes.INTERNAL_SERVER_ERROR
					)
			),
			TE.chain((hash) =>
				TE.tryCatch(
					() => bcrypt.compare(credentials.password, hash),
					(e) =>
						new BaseError(
							`Hash comparison failed for following reason: ${e}`,
							HTTPErrorTypes.INTERNAL_SERVER_ERROR,
							e
						)
				)
			),
			RTE.fromTaskEither,
			RTE.chainW(
				RTE.fromEitherK(
					E.fromPredicate(
						identity,
						() =>
							new BaseError(
								`Invalid password offered for ${credentials.registeredEmailAddress}`,
								HTTPErrorTypes.UNAUTHORIZED
							)
					)
				)
			),
			// At long last, after a harrowing journey, return the found user
			// document to send to client if all has gone well.
			RTE.map(() => foundUsr)
		);
