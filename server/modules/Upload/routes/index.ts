import { Router } from 'express';
import { authGate } from '../../auth/controllers';
import { requestImageUploadsController } from '../controllers/requestImageUploadsController';
import { IAsyncDeps } from '../../../core/asyncDeps';

const router = Router();

export const uploadRoutes = (deps: IAsyncDeps): Router => {
	router.post('/request', authGate, requestImageUploadsController(deps));

	return router;
};
