import bcrypt from 'bcrypt';
import { TLocalSignupRequest, TPassword } from '../sharedAuthTypes';
import * as TE from 'fp-ts/TaskEither';
import { PasswordHashCreationFailedError } from '../domain/PasswordHashCreationFailedError';

export const hashNewPassword = (req: TLocalSignupRequest) =>
	TE.tryCatch(
		() => bcrypt.hash(req.passWord, 10),
		(e) => PasswordHashCreationFailedError.create(e)
	);
