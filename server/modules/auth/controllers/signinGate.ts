import { Request, Response, NextFunction, RequestHandler } from 'express';
import { MAX_FAILED_LOGINS_PER_HOUR } from '../../../CONSTANTS';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import {
	constructSigninRateLimiterKey,
	getSigninLimiter,
} from '../../../core/rateLimiter';
import { TLocalUserCredentials } from '../sharedAuthTypes';

export const signinGate =
	(deps: IAsyncDeps): RequestHandler<any, any, TLocalUserCredentials> =>
	async (req, res, next) => {
		const rl = getSigninLimiter(deps);
		const rlKey = constructSigninRateLimiterKey(
			req.ip,
			req.body.registeredEmailAddress
		);

		const calcRetryTime = (msBeforeNext: number) =>
			(Math.round(msBeforeNext / 1000) || 1).toString();

		try {
			const limitStatus = await rl.get(rlKey);

			if (limitStatus !== null) {
				if (limitStatus.consumedPoints > MAX_FAILED_LOGINS_PER_HOUR) {
					res.set(
						'Retry-After',
						calcRetryTime(limitStatus.msBeforeNext)
					);
					res.status(429).send('Too many failed logins');
				}
			}

			next();
		} catch (e: any) {
			const err = new BaseError(
				`Retrieving signin rate limit status for ${rlKey} failed for reason ${
					e.message ? e.message : e
				}`,
				HTTPErrorTypes.INTERNAL_SERVER_ERROR
			);

			next(err);
		}
	};
