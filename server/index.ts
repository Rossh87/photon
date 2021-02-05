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
import Result from 'ts-result';

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
    }
}

function run() {
    const sessionSecret = process.env.SESSION_SECRET;
    let PORT = process.env.PORT ? process.env.PORT : 3000;

    if (sessionSecret === undefined) {
        throw new Error('Missing session secret: unable to initialize server');
    }

    app.use(
        session({
            secret: sessionSecret,
            saveUninitialized: false,
            resave: false,
        })
    );

    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(grantMiddleWare(grantConfig));

    app.get('/', (req, res) => {
        res.end('welcome home!');
    });

    app.get('/connect/google/auth', (req, res) => {
        // read auth code from req.session.grant
        // get user data from google People api
        // get user data from local db
        // update data and save changes to db, if any.  If no changes, do not waste the db call
        // generate new session and populate its user property
    });

    app.listen(process.env.PORT || 3000, () => {
        console.log(`listening on ${PORT}`);
    });
}

run();
