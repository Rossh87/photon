import { emailIsAvailable } from '../repo/emailIsAvailable';
import { LocalUserCredentials } from '../sharedAuthTypes';
import { flow, pipe } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/ReaderTaskEither';
import { hashNewPassword } from '../helpers/hashNewPassword';
import { profilePropsFromLocalSignup } from '../helpers/profilePropsFromLocalSignup';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { MongoClient } from 'mongodb';
import { saveNewLocalUser } from '../repo/saveNewLocalUser';
import { InvalidSignupError } from '../domain/InvalidSignupError';
import { isErrors } from '../domain/guards';

const saveUser = flow(
	saveNewLocalUser,
	RTE.local<IAsyncDeps, MongoClient>((d) => d.repoClient)
);

export const signupLocalUser = (u: unknown) =>
	pipe(
		u,
		RTE.fromEitherK(LocalUserCredentials.decode),
		RTE.bindTo('request'),
		RTE.chainFirstW((x) => emailIsAvailable(x.request)),
		RTE.bindW('hashedPassword', (x) =>
			RTE.fromTaskEither(hashNewPassword(x.request))
		),
		RTE.map(({ hashedPassword, request }) =>
			profilePropsFromLocalSignup(hashedPassword)(request)
		),
		RTE.chainW(saveUser),
		// convert io-ts validation errs to a BaseError
		RTE.mapLeft((e) =>
			isErrors(e)
				? InvalidSignupError.create(
						'validation failed',
						'Email or password invalid',
						e
				  )
				: e
		)
	);
