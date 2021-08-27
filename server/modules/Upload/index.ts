import { Router } from 'express';
import { authGate } from '../auth/controllers';
import { requestImageUploadsController } from './controllers/requestImageUploadsController';
import { saveUploadMetadataController } from './controllers/saveUploadMetadataController';
import { dedupeNamesController } from './controllers/dedupeNamesController';
import { getUploadMetadataController } from './controllers/getUploadMetadataController';
import { IAsyncDeps } from './../../core/asyncDeps';
import { updateBreakpointsController } from './controllers/updateBreakpointsController';

const router = Router();

export const uploadRoutes = (deps: IAsyncDeps): Router => {
	router.post('/request', authGate, requestImageUploadsController(deps));

	router.post('/save', authGate, saveUploadMetadataController(deps));

	router.get('/retrieve', authGate, getUploadMetadataController(deps));

	// TODO: technically this is a query, so POST isn't super-appropriate, but it's
	// easier to work with JSON data this way for now.
	router.post('/deduplicate', authGate, dedupeNamesController(deps));

	router.put('/syncbreakpoints', authGate, updateBreakpointsController(deps));

	return router;
};
