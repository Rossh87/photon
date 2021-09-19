// Setup env vars
import path from 'path';
const dotenv = require('dotenv');
const env_path = path.join(__dirname, '.env.local');
console.log(env_path);
dotenv.config({ path });

import express, { NextFunction } from 'express';
import session from 'express-session';
import grant, { GrantResponse } from 'grant';
import grantConfig from './configs/grantConfig';
import requiredInEnv from './configs/requiredInEnv';
import axios from 'axios';
import { TSessionUser } from '../sharedTypes/User';
import { IAsyncDeps } from './core/asyncDeps';
import { MongoClient } from 'mongodb';
import { TEST_DB_URI } from './CONSTANTS';
import cors from 'cors';
import { gcs } from './core/gcs';
import { makeReadEnv } from './core/readEnv';
import { errorHandler } from './modules/errorHandler';
import { getLoggers } from './core/morgan';

// routes
import { authRoutes } from './modules/auth';
import { uploadRoutes } from './modules/Upload';
import { userRoutes } from './modules/User';
import { BaseError } from './core/error';
import { rateLimiterMiddleware } from './core/rateLimiter';

// initialize needed objects
const app = express();
const grantMiddleWare = grant.express();

// Module augmentation to tell TS compiler about the properties grant will add
// to req.session
declare module 'express-session' {
	interface SessionData {
		grant: {
			response: GrantResponse;
		};

		user?: TSessionUser;
	}
}

async function run() {
	const sessionSecret = process.env.SESSION_SECRET;
	const PORT = process.env.PORT ? process.env.PORT : 3000;

	if (sessionSecret === undefined) {
		throw new Error('Missing session secret: unable to initialize server');
	}

	// setup middlewares
	app.use(
		session({
			secret: sessionSecret,
			saveUninitialized: false,
			resave: true,
			name: 'lossy-sessid',
			cookie: {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production' ? true : false,
				sameSite: process.env.NODE_ENV === 'production' ? true : false,
				maxAge: 60 * 60,
			},
		})
	);

	if (process.env.NODE_ENV !== 'production') {
		app.use(
			cors({
				origin: 'http://localhost:3000',
				credentials: true,
			})
		);
	}
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());

	app.use(grantMiddleWare(grantConfig));

	// add a property to represent failure message that we'll use in logging
	app.use((req, res, next) => {
		req.failureMessage = { message: '', raw: '' } as BaseError;
		next();
	});
	const { devLogger, errLogger, accessLogger } = await getLoggers();

	app.use(devLogger());
	app.use(errLogger());
	app.use(accessLogger());

	const repoClient = await MongoClient.connect(TEST_DB_URI);

	const rlmw = rateLimiterMiddleware(repoClient);

	app.use(rlmw);

	// this will blow up right away if needed env vars are missing
	const asyncDeps: IAsyncDeps = {
		fetcher: axios,
		repoClient,
		gcs,
		readEnv: makeReadEnv(requiredInEnv, process.env),
	};

	app.use('/auth/', authRoutes(asyncDeps));

	app.use('/upload/', uploadRoutes(asyncDeps));

	app.use('/user/', userRoutes(asyncDeps));

	app.use(errorHandler);

	app.listen(process.env.PORT || 3000, () => {
		console.log(`listening on ${PORT}`);
	});
}

run();
