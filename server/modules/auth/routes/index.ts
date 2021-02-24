import { Router } from 'express';
import { googleOAuthController } from '../controllers/googleOAuthController';
import { logoutController } from '../controllers/logoutController';
import { IAsyncDeps } from '../../../core/asyncDeps';

const router = Router();

export const authRoutes = (deps: IAsyncDeps): Router => {
    router.get('/google/callback', googleOAuthController(deps));

    router.get('/logout', logoutController);

    return router;
};
