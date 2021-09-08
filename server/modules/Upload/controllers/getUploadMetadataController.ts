import { RequestHandler } from 'express';
import {
	runEffects,
	toEffects,
	addAndApplyEffect,
	addEffect,
	setStatusEffect,
	toJSONEffect,
	toErrHandlerEffect,
	setLogFailureMessageEffect,
	standardFailureEffects,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { pipe } from 'fp-ts/lib/function';
import { getUploadMetadata } from '../repo/getUploadMetadata';
import { IUploadsRequestPayload } from 'sharedTypes/Upload';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { flow } from 'fp-ts/lib/function';
import { TDBUser, TSessionUser } from 'sharedTypes/User';

const successEffects = flow(
	toEffects,
	addEffect(setStatusEffect(200)),
	addAndApplyEffect(toJSONEffect)
);

export const getUploadMetadataController =
	(deps: IAsyncDeps): RequestHandler<any, any, IUploadsRequestPayload> =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);

		// safe to cast since we're behind auth gate
		const { _id } = req.session.user as TSessionUser;

		await pipe(
			_id,
			getUploadMetadata,
			RTE.map(successEffects),
			RTE.mapLeft(standardFailureEffects),
			RTE.bimap(runner, runner)
		)(deps)();
	};
