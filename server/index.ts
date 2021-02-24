// Setup env vars
import path from 'path';
const dotenv = require('dotenv');
const env_path = path.join(__dirname, '.env.local');
console.log(env_path);
dotenv.config({ path });

import express from 'express';
import session from 'express-session';
import grant, { GrantResponse } from 'grant';
import grantConfig from './configs/grantConfig';
import bodyParser from 'body-parser';
import axios from 'axios';
import { IUser } from './modules/User';
import { IAsyncDeps } from './core/asyncDeps';
import { MongoClient } from 'mongodb';
import { TEST_DB_URI } from './CONSTANTS';

// routes
import { authRoutes } from './modules/auth/routes';

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

        user?: IUser;
    }
}

//

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
            resave: false,
        })
    );

    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(grantMiddleWare(grantConfig));

    const repoClient = await MongoClient.connect(TEST_DB_URI, {
        useUnifiedTopology: true,
    });

    const asyncDeps: IAsyncDeps = {
        fetcher: axios,
        repoClient,
    };

    app.get('/', (req, res) => {
        req.session.user ? res.json(req.session.user) : res.end('no user');
    });

    app.use('/auth/', authRoutes(asyncDeps));

    app.listen(process.env.PORT || 3000, () => {
        console.log(`listening on ${PORT}`);
    });
}

run();
