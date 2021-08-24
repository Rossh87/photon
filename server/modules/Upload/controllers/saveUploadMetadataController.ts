import { RequestHandler } from 'express';
import {
	runEffects,
	toEffects,
	addAndApplyEffect,
	addEffect,
	setStatusEffect,
	toErrHandlerEffect,
	TExpressEffect,
	resEndEffect,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { pipe } from 'fp-ts/lib/function';
import { saveUploadMetadata } from '../repo/saveUploadMetadata';
import { ICombinedUploadRequestMetadata } from '../sharedUploadTypes';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { flow } from 'fp-ts/lib/function';
import { IDBUser } from '../../User/sharedUserTypes';
import { attachBreakpointsToMetadata } from '../helpers/attachBreakpointsToMetadata';

const updateUsageMetricsEffect =
	(uploadData: ICombinedUploadRequestMetadata): TExpressEffect =>
	(req, res, next) => {
		// cast this--can't be null/undefined since this handler comes after auth gate handler
		// that explicitly checks this property
		const { uploadUsage, imageCount } = req.session.user as IDBUser;

		req.session.user = Object.assign({}, req.session.user, {
			uploadUsage: uploadUsage + uploadData.sizeInBytes,
			imageCount: imageCount + 1,
		});
	};

const successEffects = flow(
	toEffects,
	addAndApplyEffect(updateUsageMetricsEffect),
	addEffect(setStatusEffect(200)),
	addEffect(resEndEffect)
);

const failureEffects = flow(toEffects, addAndApplyEffect(toErrHandlerEffect));

export const saveUploadMetadataController =
	(
		deps: IAsyncDeps
	): RequestHandler<any, any, ICombinedUploadRequestMetadata> =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);

		await pipe(
			req.body,
			// here we attach an empty array for saving user-defined breakpoints
			attachBreakpointsToMetadata,
			saveUploadMetadata,
			RTE.map(successEffects),
			RTE.mapLeft(failureEffects),
			RTE.bimap(runner, runner)
		)(deps)();
	};
