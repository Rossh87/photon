import { RequestHandler } from 'express';
import {
	addAndApplyEffect,
	addEffect,
	clientRootRedirectEffect,
	runEffects,
	setLogFailureMessageEffect,
	setSessionUserEffect,
	standardFailureEffects,
	toEffects,
	toErrHandlerEffect,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { IOAuthCallbackConfig } from './oAuthCallbackConfigs';
import { flow, pipe } from 'fp-ts/lib/function';
import { extractOAuthToken, updateOrAddUser } from '../helpers';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { requestOAuthData } from '../helpers/requestOAuthData';

const oAuthSuccessEffects = flow(
	toEffects,
	addAndApplyEffect(setSessionUserEffect),
	addEffect(clientRootRedirectEffect)
);

export const makeOAuthCallbackController =
	(config: IOAuthCallbackConfig) =>
	(deps: IAsyncDeps): RequestHandler =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);

		await pipe(
			req,
			extractOAuthToken,
			RTE.fromEither,
			RTE.chain(requestOAuthData(config)),
			RTE.chainW((x) => RTE.fromEither(config.normalizer(x))),
			RTE.chain(updateOrAddUser),
			RTE.map(oAuthSuccessEffects),
			RTE.mapLeft(standardFailureEffects),
			RTE.map(runner),
			RTE.mapLeft(runner)
		)(deps)();
	};
