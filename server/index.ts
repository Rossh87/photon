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
import axios from 'axios';
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

        views: number;
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

    app.get('/auth/google/callback', async (req, res) => {
        console.log(req.session.grant);

        const token = req.session.grant?.response.access_token;

        if (!token) {
            res.end('no token');
        }
        const axiosConfig = {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        };

        const peopleURL =
            'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses';

        const resp = await axios.get(peopleURL, axiosConfig);
        res.json(resp.data);
    });

    app.listen(process.env.PORT || 3000, () => {
        console.log(`listening on ${PORT}`);
    });
}

run();
