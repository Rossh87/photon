import { RequestHandler } from 'express';
import {
	runEffects,
	toEffects,
	addAndApplyEffect,
	addEffect,
	setStatusEffect,
	toJSONEffect,
	standardFailureEffects,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { pipe } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { flow } from 'fp-ts/lib/function';
import { ILocalSignupRequestPayload } from 'sharedTypes/User';
import { signupLocalUser } from '../useCases/signupLocalUser';
import { formatNewLocalUserForClient } from '../helpers/formatNewLocalUserForClient';

const successEffects = flow(
	toEffects,
	addEffect(setStatusEffect(200)),
	addAndApplyEffect(toJSONEffect)
);

export const signupLocalUserController =
	(deps: IAsyncDeps): RequestHandler<any, any, ILocalSignupRequestPayload> =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);
		const signupRequest = req.body;

		await pipe(
			signupRequest,
			signupLocalUser,
			RTE.map(formatNewLocalUserForClient),
			RTE.map(successEffects),
			RTE.mapLeft(standardFailureEffects),
			RTE.bimap(runner, runner)
		)(deps)();
	};
