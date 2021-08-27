import { RequestHandler } from 'express';
import {
	runEffects,
	toEffects,
	addAndApplyEffect,
	addEffect,
	setStatusEffect,
	toJSONEffect,
	toErrHandlerEffect,
	resEndEffect,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { pipe } from 'fp-ts/lib/function';
import { TDedupeNamesPayload } from '../sharedUploadTypes';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { flow } from 'fp-ts/lib/function';
import { IDBUser } from '../../User/sharedUserTypes';
import { getDupeDisplayNames } from '../repo/getDupeDisplayNames';
import { IBreakpointTransferObject } from '../../../../sharedTypes/Upload';
import { updateBreakpoints } from '../repo/updateBreakpoints';

const successEffects = flow(toEffects, addAndApplyEffect(toJSONEffect));

const failureEffects = flow(toEffects, addAndApplyEffect(toErrHandlerEffect));

export const updateBreakpointsController =
	(deps: IAsyncDeps): RequestHandler<any, any, IBreakpointTransferObject> =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);
		await pipe(
			req.body,
			updateBreakpoints,
			RTE.map((results) => results.value),
			RTE.map(successEffects),
			RTE.mapLeft(failureEffects),
			RTE.bimap(runner, runner)
		)(deps)();
	};
