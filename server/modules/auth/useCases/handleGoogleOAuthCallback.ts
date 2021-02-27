import { IGoogleOAuthResponse } from '../sharedAuthTypes';
import { flow, pipe } from 'fp-ts/lib/function';
import {
    extractOAuthToken,
    googleDataRequestor,
    GoogleNormalizationError,
    normalizeGoogleResponse,
    TGoogleNormalizerResult,
    TGoogleRequestResult,
    updateOrAddUser,
    TUpdateOrAddUserResult,
} from '../helpers';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as R from 'fp-ts/lib/Reader';
import { IAsyncDeps, getRepo, getFetcher } from '../../../core/asyncDeps';
import {
    setSessionEffect,
    rootRedirectEffect,
    toEffects,
    addEffect,
    addAndApplyEffect,
    toErrHandlerEffect,
} from '../../../core/expressEffects';
import { IUser } from '../../User/sharedUserTypes';

// extracted from the main function b/c the types are obnoxious
const normalizeResponse = flow<
    ReadonlyArray<IGoogleOAuthResponse>,
    TGoogleNormalizerResult,
    RTE.ReaderTaskEither<IAsyncDeps, GoogleNormalizationError, IUser>
>(normalizeGoogleResponse, RTE.fromEither);

const oAuthSuccessEffects = flow(
    toEffects,
    addAndApplyEffect(setSessionEffect),
    addEffect(rootRedirectEffect)
);

const oAuthFailureEffects = flow(
    toEffects,
    addAndApplyEffect(toErrHandlerEffect)
);

// TODO: at some point we could refactor these 'asks' statements
// to be prettier
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
    ),
    RTE.map(oAuthSuccessEffects),
    RTE.mapLeft(oAuthFailureEffects)
);
