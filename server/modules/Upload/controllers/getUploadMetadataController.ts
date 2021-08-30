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
import { getUploadMetadata } from '../repo/getUploadMetadata';
import { IUploadsRequestPayload } from 'sharedTypes/Upload';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { flow } from 'fp-ts/lib/function';
import { TDBUser } from 'sharedTypes/User';

const successEffects = flow(
	toEffects,
	addEffect(setStatusEffect(200)),
	addAndApplyEffect(toJSONEffect)
);

const failureEffects = flow(toEffects, addAndApplyEffect(toErrHandlerEffect));

export const getUploadMetadataController =
	(deps: IAsyncDeps): RequestHandler<any, any, IUploadsRequestPayload> =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);

		// safe to cast since we're behind auth gate
		const { _id } = req.session.user as TDBUser;

		await pipe(
			_id as unknown as string,
			getUploadMetadata,
			RTE.map(successEffects),
			RTE.mapLeft(failureEffects),
			RTE.bimap(runner, runner)
		)(deps)();
	};
