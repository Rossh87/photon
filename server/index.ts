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
import { TDBUser } from '../sharedTypes/User';
import { IAsyncDeps } from './core/asyncDeps';
import { MongoClient } from 'mongodb';
import { TEST_DB_URI } from './CONSTANTS';
import cors from 'cors';
import { gcs } from './core/gcs';
import { makeReadEnv } from './core/readEnv';
import { errorHandler } from './modules/errorHandler';

// routes
import { authRoutes } from './modules/auth';
import { uploadRoutes } from './modules/Upload';
import { userRoutes } from './modules/User';

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

		user?: TDBUser;
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
		})
	);

	app.use(
		cors({
			origin: 'http://localhost:3000',
			credentials: true,
		})
	);
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());

	app.use(grantMiddleWare(grantConfig));

	const repoClient = await MongoClient.connect(TEST_DB_URI, {
		useUnifiedTopology: true,
	});

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
