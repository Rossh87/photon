import { RequestHandler } from 'express';
import {
	runEffects,
	toEffects,
	addAndApplyEffect,
	toJSONEffect,
	toErrHandlerEffect,
	standardFailureEffects,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { pipe } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { flow } from 'fp-ts/lib/function';
import { IBreakpointTransferObject } from 'sharedTypes/Upload';
import { updateBreakpoints } from '../repo/updateBreakpoints';

const successEffects = flow(toEffects, addAndApplyEffect(toJSONEffect));

export const updateBreakpointsController =
	(deps: IAsyncDeps): RequestHandler<any, any, IBreakpointTransferObject> =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);
		await pipe(
			req.body,
			updateBreakpoints,
			RTE.map((results) => results.value),
			RTE.map(successEffects),
			RTE.mapLeft(standardFailureEffects),
			RTE.bimap(runner, runner)
		)(deps)();
	};
