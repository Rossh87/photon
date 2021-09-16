import { ExpressMiddleware } from 'grant';
import { MongoClient } from 'mongodb';
import {
	RateLimiterMongo,
	IRateLimiterMongoOptions,
	RateLimiterMemory,
} from 'rate-limiter-flexible';
import { RequestHandler } from 'express';
import { IAsyncDeps } from './asyncDeps';

// NB: this client needs to already be connected for this to work
export const rateLimiterMiddleware = (connectedDB: MongoClient) => {
	const insuranceLimiter = new RateLimiterMemory({
		points: 20,
		duration: 2,
	});

	const mongoRLOptions: IRateLimiterMongoOptions = {
		// max 20 requests/second, block IP for 3 hours when exceeded
		storeClient: connectedDB,
		points: 20,
		duration: 1,
		blockDuration: 60 * 60 * 12,
		insuranceLimiter,
	};

	const mongoRL = new RateLimiterMongo(mongoRLOptions);

	const mw: RequestHandler = (req, res, next) => {
		mongoRL
			.consume(req.ip)
			.then(() => next())
			.catch((_) => res.status(429).send('Request rate exceeded'));
	};

	return mw;
};

// We don't want to reinit limiters with each request, so we essentially create a singleton here
let signinLimiter: RateLimiterMongo;

export const rateLimiterKeyPrefix = 'consec_signin_username_ip';

const initSigninRateLimiter = (connectedDB: MongoClient) => {
	if (signinLimiter === undefined) {
		const consecSigninLimiter = new RateLimiterMongo({
			storeClient: connectedDB,
			keyPrefix: rateLimiterKeyPrefix,
			points: 8,
			duration: 60 * 60,
			inmemoryBlockDuration: 60 * 60 * 24,
			inmemoryBlockOnConsumed: 8,
		});

		signinLimiter = consecSigninLimiter;
	}

	return;
};

export const getSigninLimiter = (deps: IAsyncDeps) => {
	if (signinLimiter === undefined) {
		initSigninRateLimiter(deps.repoClient);
	}

	return signinLimiter;
};

export const constructSigninRateLimiterKey = (
	ipAddr: string,
	emailAddr: string
) => `${ipAddr}_ ${emailAddr}`;
