import { RequestHandler } from 'express';
import {
	runEffects,
	toEffects,
	addAndApplyEffect,
	addEffect,
	setStatusEffect,
	toJSONEffect,
	toErrHandlerEffect,
	TExpressEffect,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { pipe } from 'fp-ts/lib/function';
import { saveUploadMetadata } from '../helpers/saveUploadMetadata';
import { ICombinedUploadRequestMetadata } from '../sharedUploadTypes';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { flow } from 'fp-ts/lib/function';
import { IDBUser } from '../../User/sharedUserTypes';

const updateUsageMetricsEffect = (
	uploadData: ICombinedUploadRequestMetadata
): TExpressEffect => (req, res, next) => {
	// cast this--can't be null/undefined since this handler comes after auth gate handler
	// that explicitly checks this property
	const { uploadUsage, imageCount } = req.session.user as IDBUser;

	req.session.user = Object.assign(req.session.user, {
		uploadUsage: uploadUsage + uploadData.sizeInBytes,
		imageCount: imageCount + 1,
	});
};

const responseEffects = flow(
	toEffects,
	addEffect(setStatusEffect(200)),
	addAndApplyEffect(updateUsageMetricsEffect)
);

const handleErr = flow(toEffects, addAndApplyEffect(toErrHandlerEffect));

export const saveUploadMetadataController = (
	deps: IAsyncDeps
): RequestHandler<any, any, ICombinedUploadRequestMetadata> => (
	req,
	res,
	next
) => {
	const runner = runEffects(req, res, next);

	pipe(
		saveUploadMetadata(req.body),
		RTE.map(responseEffects),
		RTE.map(runner),
		RTE.mapLeft(handleErr)
	)(deps)();
};
