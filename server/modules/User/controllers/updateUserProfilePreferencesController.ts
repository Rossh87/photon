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
	toJSONEffect,
} from '../../../core/expressEffects';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { flow, pipe } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import {
	IUserProfilePreferencesTransportObject,
	TDBUser,
} from 'sharedTypes/User';
import { updateProfilePreferences } from '../useCases/updateProfilePreferences';
import { formatValidationErrs } from '../helpers/formatValidationErrors';

const updateSessionUserEffect =
	(newPrefs: IUserProfilePreferencesTransportObject): TExpressEffect =>
	(req, res, next) => {
		// cast here since we know session user can't be null/undefined
		req.session.user = {
			...req.session.user,
			userPreferences: { ...newPrefs },
		} as TDBUser;
	};

const validationFailureEffects = flow(
	toEffects,
	addEffect(setStatusEffect(400)),
	addAndApplyEffect(flow(formatValidationErrs, toJSONEffect))
);

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
			updateProfilePreferences(req.body, _id as unknown as string),
			RTE.map(() => req.body),
			RTE.map(successEffects),
			// Handle errs differently based on whether they are validation errs
			// Or a DB failure error
			// TODO: this should properly be a true type-guard
			RTE.mapLeft((err) =>
				Array.isArray(err)
					? validationFailureEffects(err)
					: standardFailureEffects(err)
			),
			RTE.bimap(runner, runner)
		)(deps)();
	};
