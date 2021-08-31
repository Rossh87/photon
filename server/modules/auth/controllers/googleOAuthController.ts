import { makeOAuthCallbackController } from './makeOAuthCallbackController';
import { oAuthCallbackConfigs } from './oAuthCallbackConfigs';

export const googleOAuthController = makeOAuthCallbackController(
	oAuthCallbackConfigs.google
);
