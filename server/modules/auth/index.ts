import { IGoogleOAuthResponse } from './sharedAuthTypes';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import { Request } from 'express';
import {
    extractOAuthToken,
    googleDataRequestor,
    GoogleDataRequestErr,
    normalizeGoogleResponse,
    TGoogleRequestResult,
} from './helpers';
import { getUserByID, TGetUserByIDResult } from '../User/repo/getUserByID';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as R from 'fp-ts/lib/Reader';
import { IAsyncDeps, getFetcher, getRepo } from '../../core/asyncDeps';
import { IUser } from '../User/userTypes';

export const handleGoogleOAuthCallback = flow(
    extractOAuthToken,
    RTE.fromEither,
    RTE.chain((token) =>
        R.asks<IAsyncDeps, TGoogleRequestResult>(
            flow(getFetcher, googleDataRequestor(token))
        )
    ),
    RTE.map(normalizeGoogleResponse),
    RTE.chain((responseUser) => R.asks<IAsyncDeps, IUser>(flow()))
);

export const getToken = (req: Request) =>
    pipe(req, (r) => Object.assign({}, req), extractOAuthToken, RTE.fromEither);
