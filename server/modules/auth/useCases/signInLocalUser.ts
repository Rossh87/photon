import { pipe } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/ReaderTaskEither';
import { retrieveLocalUser } from '../repo/retrieveLocalUser';
import * as E from 'fp-ts/Either';
import { TLocalUserCredentials } from '../sharedAuthTypes';
import { comparePasswordHashes } from '../helpers/comparePasswordHashes';
import { Request } from 'express';
import { updateFailedSigninCount } from '../helpers/updateFailedSigninCount';

export const signInLocalUser = (
	req: Request<any, any, TLocalUserCredentials>
) =>
	pipe(
		retrieveLocalUser(req.body),
		RTE.chainW((foundUser) => comparePasswordHashes(foundUser)(req.body)),

		// if the error is the result of invalid credentials, increment
		// the signin failure rate limiter
		RTE.orElseFirst((e) =>
			e.HTTPErrorType.status === 401
				? updateFailedSigninCount(req)
				: RTE.fromEither(E.left(e))
		)
	);
