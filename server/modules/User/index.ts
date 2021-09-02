import { Router } from 'express';
import { IAsyncDeps } from '../../core/asyncDeps';
import { authGate } from '../auth/controllers';
import { updateUserProfilePreferencesController } from './controllers/updateUserProfilePreferencesController';

const router = Router();

export const userRoutes = (deps: IAsyncDeps): Router => {
	router.put(
		'/update-profile-preferences',
		authGate,
		updateUserProfilePreferencesController(deps)
	);

	return router;
};
