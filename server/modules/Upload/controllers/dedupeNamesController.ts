import { RequestHandler } from 'express';
import {
	runEffects,
	toEffects,
	addAndApplyEffect,
	addEffect,
	setStatusEffect,
	toJSONEffect,
	toErrHandlerEffect,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { pipe } from 'fp-ts/lib/function';
import { TDedupeNamesPayload } from '../sharedUploadTypes';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { flow } from 'fp-ts/lib/function';
import { TDBUser } from 'sharedTypes/User';
import { getDupeDisplayNames } from '../repo/getDupeDisplayNames';

const successEffects = flow(
	toEffects,
	addEffect(setStatusEffect(200)),
	addAndApplyEffect(toJSONEffect)
);

const failureEffects = flow(toEffects, addAndApplyEffect(toErrHandlerEffect));

export const dedupeNamesController =
	(deps: IAsyncDeps): RequestHandler<any, any, TDedupeNamesPayload> =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);

		// safe to cast since we're behind auth gate
		const { _id } = req.session.user as TDBUser;
		const displayNames = req.body.displayNames;

		await pipe(
			getDupeDisplayNames(_id as unknown as string)(displayNames),
			RTE.map(successEffects),
			RTE.mapLeft(failureEffects),
			RTE.bimap(runner, runner)
		)(deps)();
	};
