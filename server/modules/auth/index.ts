import { IGoogleOAuthResponse } from './sharedAuthTypes';
import { flow } from 'fp-ts/lib/function';
import {
    extractOAuthToken,
    googleDataRequestor,
    TGoogleOAuthRequestor,
    GoogleNormalizationError,
    normalizeGoogleResponse,
    TGoogleNormalizerResult,
    TGoogleRequestResult,
    updateOrAddUser,
    TUpdateOrAddUserResult,
} from './helpers';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as R from 'fp-ts/lib/Reader';
import { IAsyncDeps, getRepo, getFetcher } from '../../core/asyncDeps';
import { IUser } from '../User';

const normalizeResponse = flow<
    ReadonlyArray<IGoogleOAuthResponse>,
    TGoogleNormalizerResult,
    RTE.ReaderTaskEither<IAsyncDeps, GoogleNormalizationError, IUser>
>(normalizeGoogleResponse, RTE.fromEither);

export const handleGoogleOAuthCallback = flow(
    extractOAuthToken,
    RTE.fromEither,
    RTE.chain((token) =>
        R.asks<IAsyncDeps, TGoogleRequestResult>(
            flow(getFetcher, googleDataRequestor(token))
        )
    ),
    RTE.chain(normalizeResponse),
    RTE.chain((responseUser) =>
        R.asks<IAsyncDeps, TUpdateOrAddUserResult>(
            flow(getRepo, updateOrAddUser(responseUser))
        )
    )
);
