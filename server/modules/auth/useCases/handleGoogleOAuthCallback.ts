import { flow } from 'fp-ts/lib/function';
import {
	extractOAuthToken,
	requestGoogleData,
	normalizeGoogleResponse,
	updateOrAddUser,
} from '../helpers';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as RT from 'fp-ts/lib/ReaderTask';

import * as E from 'fp-ts/lib/Either';
import {
	setSessionEffect,
	clientRootRedirectEffect,
	toEffects,
	addEffect,
	addAndApplyEffect,
	toErrHandlerEffect,
} from '../../../core/expressEffects';

const oAuthSuccessEffects = flow(
	toEffects,
	addAndApplyEffect(setSessionEffect),
	addEffect(clientRootRedirectEffect)
);

const oAuthFailureEffects = flow(
	toEffects,
	addAndApplyEffect(toErrHandlerEffect)
);

export const handleGoogleOAuthCallback = flow(
	extractOAuthToken,
	RTE.fromEither,
	RTE.chain(requestGoogleData),
	RT.map(E.chain(normalizeGoogleResponse)),
	RTE.chain(updateOrAddUser),
	RTE.map(oAuthSuccessEffects),
	RTE.mapLeft(oAuthFailureEffects)
);
