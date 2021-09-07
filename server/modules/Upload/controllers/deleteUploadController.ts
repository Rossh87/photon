import { RequestHandler } from 'express';
import {
	runEffects,
	toEffects,
	addAndApplyEffect,
	addEffect,
	setStatusEffect,
	toErrHandlerEffect,
	resEndEffect,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { pipe } from 'fp-ts/lib/function';
import { IUploadDeletionPayload } from 'sharedTypes/Upload';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { flow } from 'fp-ts/lib/function';
import { TDBUser } from 'sharedTypes/User';
import { deleteUpload } from '../useCases/deleteUpload';

const successEffects = flow(
	toEffects,
	addEffect(setStatusEffect(200)),
	addEffect(resEndEffect)
);

const failureEffects = flow(toEffects, addAndApplyEffect(toErrHandlerEffect));

export const deleteUploadController =
	(
		deps: IAsyncDeps
	): RequestHandler<{ _id: string }, any, IUploadDeletionPayload> =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);

		// safe to cast since we're behind auth gate
		const authenticatedID = req.session.user?._id as unknown as string;
		const idToDelete = req.params._id;

		await pipe(
			deleteUpload({ idToDelete }, authenticatedID),
			RTE.map(successEffects),
			RTE.mapLeft(failureEffects),
			RTE.bimap(runner, runner)
		)(deps)();
	};
