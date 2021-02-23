import { handleGoogleOAuthCallback } from '../useCases/handleGoogleOAuthCallback';
import { RequestHandler } from 'express';
import { runEffects } from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

export const googleOAuthController = (deps: IAsyncDeps): RequestHandler => (
    req,
    res,
    next
) => {
    const runner = runEffects(req, res, next);

    pipe(
        handleGoogleOAuthCallback(req)(deps),
        TE.map(runner),
        TE.mapLeft(runner)
    )();
};
