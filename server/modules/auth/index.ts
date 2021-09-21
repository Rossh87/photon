import { Router } from 'express';
import {
	googleOAuthController,
	logoutController,
	authGate,
	authorizeClientController,
	githubOAuthController,
} from './controllers';
import { IAsyncDeps } from '../../core/asyncDeps';
import { signupLocalUserController } from './controllers/signupLocalUserController';
import { signinLocalUserController } from './controllers/signinLocalUserController';

const router = Router();

export const authRoutes = (deps: IAsyncDeps): Router => {
	router.get('/google/callback', googleOAuthController(deps));

	router.get('/github/callback', githubOAuthController(deps));

	router.get('/logout', logoutController);

	router.get('/user', authorizeClientController);

	router.post('/signup', signupLocalUserController(deps));

	router.post('/signin', signinLocalUserController(deps));

	return router;
};
