import bcrypt from 'bcrypt';
import { TLocalUserCredentials, TPassword } from '../sharedAuthTypes';
import * as TE from 'fp-ts/TaskEither';
import { PasswordHashCreationFailedError } from '../domain/PasswordHashCreationFailedError';

export const hashNewPassword = (req: TLocalUserCredentials) =>
	TE.tryCatch(
		() => bcrypt.hash(req.password, 10),
		(e) => PasswordHashCreationFailedError.create(e)
	);
