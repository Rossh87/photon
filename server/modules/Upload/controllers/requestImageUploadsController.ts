import { RequestHandler } from 'express';
import {
	runEffects,
	toEffects,
	addAndApplyEffect,
	addEffect,
	setStatusEffect,
	toJSONEffect,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { pipe } from 'fp-ts/lib/function';
import { fetchAllUploadURIs } from '../useCases/fetchAllUploadURIs';
import { IUploadsRequestPayload } from '../sharedUploadTypes';
import * as RT from 'fp-ts/lib/ReaderTask';
import { flow } from 'fp-ts/lib/function';

const respond = flow(
	toEffects,
	addEffect(setStatusEffect(200)),
	addAndApplyEffect(toJSONEffect)
);

export const requestImageUploadsController =
	(deps: IAsyncDeps): RequestHandler<any, any, IUploadsRequestPayload> =>
	(req, res, next) => {
		const runner = runEffects(req, res, next);
		pipe(
			fetchAllUploadURIs(req.body.uploadRequests),
			RT.map(respond),
			RT.map(runner)
		)(deps)();
	};
