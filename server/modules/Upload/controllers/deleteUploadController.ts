import { RequestHandler } from 'express';
import {
	runEffects,
	toEffects,
	addAndApplyEffect,
	addEffect,
	setStatusEffect,
	toErrHandlerEffect,
	resEndEffect,
	setLogFailureMessageEffect,
	standardFailureEffects,
	setSessionUserEffect,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { pipe } from 'fp-ts/lib/function';
import { IUploadDeletionPayload } from 'sharedTypes/Upload';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { flow } from 'fp-ts/lib/function';
import { TDBUser } from 'sharedTypes/User';
import { deleteUpload } from '../useCases/deleteUpload';
import { ParsedQs } from 'qs';

const successEffects = flow(
	toEffects,
	addAndApplyEffect(setSessionUserEffect),
	addEffect(setStatusEffect(200)),
	addEffect(resEndEffect)
);

export const deleteUploadController =
	(
		deps: IAsyncDeps
	): RequestHandler<
		{ id: string },
		any,
		any,
		{ updatedImageCount: string }
	> =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);

		// safe to cast since we're behind auth gate
		const authenticatedID = req.session.user?._id as unknown as string;
		const { id } = req.params;
		const updatedImageCount = +req.query.updatedImageCount;

		await pipe(
			deleteUpload(
				{ idToDelete: id, updatedImageCount },
				authenticatedID
			),
			RTE.mapLeft((x) => {
				console.log(x);
				return x;
			}),
			RTE.map(() => ({
				...req.session.user,
				imageCount: updatedImageCount,
			})),
			RTE.map(successEffects),
			RTE.mapLeft(standardFailureEffects),
			RTE.bimap(runner, runner)
		)(deps)();
	};
