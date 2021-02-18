import { IGoogleOAuthResponse } from './sharedAuthTypes';
import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import { Request } from 'express';
import {
    extractOAuthToken,
    googleDataRequestor,
    normalizeGoogleResponse,
} from './helpers';
import { getUserByID } from '../User/repo';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';

export const handleGoogleOAuthCallback = (req: Request) =>
    pipe(
        req,
        // ensure no mutations
        (r) => Object.assign({}, req),
        extractOAuthToken,
        // lift Either to TaskEither
        T.of,
        TE.chain(googleDataRequestor),
        TE.map(normalizeGoogleResponse)
    );

export class AuthManager {
    constructor(private userRepo: UserRepo) {
        this.userRepo = userRepo;
    }

    // TODO: may not be great to have this method depend on an express entity(?)
    // TODO: this composition could be cleaner--not great to depend on closure...
    handleGoogleOAuthCallback(req: Request) {
        return pipe(
            req,
            extractOAuthToken,
            T.of,
            TE.chain(googleDataRequestor),
            TE.map(normalizeGoogleResponse)
            // get user from DB
        );
    }
}
