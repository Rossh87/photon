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
import { signupLocalUser } from '../useCases/signupLocalUser';
import { ILocalUserCredentials } from '../../../../sharedTypes/User';
import { formatLocalUserForClient } from '../helpers/formatNewLocalUserForClient';

const successEffects = flow(
	toEffects,
	addEffect(setStatusEffect(200)),
	addAndApplyEffect(setSessionUserEffect),
	addAndApplyEffect(toJSONEffect)
);

export const signupLocalUserController =
	(deps: IAsyncDeps): RequestHandler<any, any, ILocalUserCredentials> =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);
		const signupRequest = req.body;

		await pipe(
			signupRequest,
			signupLocalUser,
			RTE.map(formatLocalUserForClient),
			RTE.map(successEffects),
			RTE.mapLeft(standardFailureEffects),
			RTE.bimap(runner, runner)
		)(deps)();
	};
