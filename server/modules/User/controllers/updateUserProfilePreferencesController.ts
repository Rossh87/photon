import { RequestHandler } from 'express';
import {
	addAndApplyEffect,
	addEffect,
	clientRootRedirectEffect,
	resEndEffect,
	runEffects,
	setSessionUserEffect,
	setStatusEffect,
	standardFailureEffects,
	TExpressEffect,
	toEffects,
	toErrHandlerEffect,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { flow, pipe } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { updateUserProfilePreferences } from '../repo/updateUserProfilePreferences';
import {
	IUserProfilePreferencesTransportObject,
	TDBUser,
} from '../../../../sharedTypes/User';
import { preferencesToPrefPayload } from '../helpers/preferencesToPrefPayload';

const updateSessionUserEffect =
	(newPrefs: IUserProfilePreferencesTransportObject): TExpressEffect =>
	(req, res, next) => {
		// cast here since we know session user can't be null/undefined
		req.session.user = {
			...req.session.user,
			userPreferences: { ...newPrefs },
		} as TDBUser;
	};

const successEffects = flow(
	toEffects,
	addAndApplyEffect(updateSessionUserEffect),
	addEffect(setStatusEffect(204)),
	addEffect(resEndEffect)
);

export const updateUserProfilePreferencesController =
	(
		deps: IAsyncDeps
	): RequestHandler<any, any, IUserProfilePreferencesTransportObject> =>
	async (req, res, next) => {
		const runner = runEffects(req, res, next);

		const { _id } = req.session.user as TDBUser;

		await pipe(
			preferencesToPrefPayload(req.body, _id as unknown as string),
			updateUserProfilePreferences,
			RTE.map(() => req.body),
			RTE.map(successEffects),
			RTE.mapLeft(standardFailureEffects),
			RTE.map(runner),
			RTE.mapLeft(runner)
		)(deps)();
	};
