import { Router } from 'express';
import {
	googleOAuthController,
	logoutController,
	authGate,
	authorizeClientController,
} from './controllers';
import { IAsyncDeps } from '../../core/asyncDeps';

const router = Router();

export const authRoutes = (deps: IAsyncDeps): Router => {
	router.get('/google/callback', googleOAuthController(deps));

	router.get('/logout', logoutController);

	router.get('/user', authGate, authorizeClientController);

	return router;
};
