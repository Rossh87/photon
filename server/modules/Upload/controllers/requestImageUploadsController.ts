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
import { fetchAllUploadURIs } from '../useCases/fetchAllUploadURIs';
import { IUploadsRequestPayload } from 'sharedTypes/Upload';
import { confirmAvailableUploadCount } from '../helpers/confirmAvailableUploadCount';
import * as RT from 'fp-ts/lib/ReaderTask';
import * as E from 'fp-ts/Either';
import * as RTE from 'fp-ts/ReaderTaskEither';
import { flow } from 'fp-ts/lib/function';
import { TDBUser } from '../../../../sharedTypes/User';

const successEffects = flow(
	toEffects,
	addEffect(setStatusEffect(200)),
	addAndApplyEffect(toJSONEffect)
);

const failureEffects = flow(toEffects, addAndApplyEffect(toErrHandlerEffect));

export const requestImageUploadsController =
	(deps: IAsyncDeps): RequestHandler<any, any, IUploadsRequestPayload> =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);

		const user = req.session.user as TDBUser;

		const { uploadRequests } = req.body;

		await pipe(
			confirmAvailableUploadCount(user, uploadRequests),
			RT.of,
			RTE.chainW(fetchAllUploadURIs),
			RTE.map(flow(successEffects, runner)),
			RTE.mapLeft(flow(failureEffects, runner))
		)(deps)();
	};
