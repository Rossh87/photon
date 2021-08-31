import { makeOAuthCallbackController } from './makeOAuthCallbackController';
import { oAuthCallbackConfigs } from './oAuthCallbackConfigs';

export const githubOAuthController = makeOAuthCallbackController(
	oAuthCallbackConfigs.github
);
