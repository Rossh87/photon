import { TLocalUserCredentials } from '../sharedAuthTypes';
import { Request } from 'express';
import {
	getSigninLimiter,
	constructSigninRateLimiterKey,
} from '../../../core/rateLimiter';
import { IAsyncDeps } from '../../../core/asyncDeps';
import * as TE from 'fp-ts/TaskEither';
import { isError } from '../domain/guards';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import { flow, identity } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/ReaderTaskEither';

// if e is a JS error, it indicates a problem with the rate limiter.  Otherwise, it indicates
// requestor has somehow bypassed the signin limiting middleware and made an excessive failed
// login attempt.  which is bad.

const handleRateLimiterFailure = (e: unknown) =>
	isError(e)
		? new BaseError(
				`Signin rate limiter token consumption failed for reason${e.message}`,
				HTTPErrorTypes.INTERNAL_SERVER_ERROR,
				e
		  )
		: new BaseError(
				'Excessive signin attempt made after limiting middleware',
				HTTPErrorTypes.EXCESSIVE_REQUESTS,
				e
		  );

export const updateFailedSigninCount =
	(req: Request<any, any, TLocalUserCredentials>) => (deps: IAsyncDeps) => {
		const signinRL = getSigninLimiter(deps);

		const key = constructSigninRateLimiterKey(
			req.ip,
			req.body.registeredEmailAddress
		);

		return TE.tryCatch(
			() => signinRL.consume(key, 1),
			handleRateLimiterFailure
		);
	};
