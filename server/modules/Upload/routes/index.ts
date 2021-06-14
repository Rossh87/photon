import { Router } from 'express';
import { authGate } from '../../auth/controllers';
import { requestImageUploadsController } from '../controllers/requestImageUploadsController';
import { saveUploadMetadataController } from '../controllers/saveUploadMetadataController';
import { getUploadMetadataController } from '../controllers/getUploadMetadataController';
import { IAsyncDeps } from '../../../core/asyncDeps';

const router = Router();

export const uploadRoutes = (deps: IAsyncDeps): Router => {
	router.post('/request', authGate, requestImageUploadsController(deps));

	router.post('/save', authGate, saveUploadMetadataController(deps));

	router.get('/retrieve', authGate, getUploadMetadataController(deps));

	return router;
};
