import { RequestHandler } from 'express';
import {
	runEffects,
	toEffects,
	addAndApplyEffect,
	addEffect,
	setStatusEffect,
	toJSONEffect,
	standardFailureEffects,
	setSessionUserEffect,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { pipe } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { flow } from 'fp-ts/lib/function';
import { signInLocalUser } from '../useCases/signInLocalUser';
import { TLocalUserCredentials } from '../sharedAuthTypes';
import { formatLocalUserForClient } from '../helpers/formatNewLocalUserForClient';

const successEffects = flow(
	toEffects,
	addEffect(setStatusEffect(200)),
	addAndApplyEffect(setSessionUserEffect),
	addAndApplyEffect(toJSONEffect)
);

export const signinLocalUserController =
	(deps: IAsyncDeps): RequestHandler<any, any, TLocalUserCredentials> =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);

		await pipe(
			req,
			signInLocalUser,
			// strip sensitive data from database user data
			RTE.map(formatLocalUserForClient),
			RTE.map(successEffects),
			RTE.mapLeft(standardFailureEffects),
			RTE.bimap(runner, runner)
		)(deps)();
	};
