import { Request, Response, NextFunction } from 'express';
import { TDBUser, IUserProfileProperties } from '../../sharedTypes/User';
import { reverseTwo } from './utils/reverseCurried';
import { CLIENT_ROOT } from '../CONSTANTS';
import { BaseError } from './error';
import { flow } from 'fp-ts/lib/function';

export type TExpressEffectList = Array<TExpressEffect>;

export type TExpressEffect = (
	req: Request,
	res: Response,
	next: NextFunction
) => void;

export type TWithExpressEffects<T> = [T, TExpressEffectList];

export const toEffects = <T>(value: T): TWithExpressEffects<T> => [value, []];

export const _addEffect =
	<T>(effects: TWithExpressEffects<T>) =>
	(a: TExpressEffect): TWithExpressEffects<T> =>
		[effects[0], [...effects[1], a]];

export const addEffect = reverseTwo(_addEffect);

// similar to addEffect, but instead of accepting an Effect argument,
// it takes a function that returns an Effect and calls it with whatever
// value the EffectList is storing
export const _addAndApplyEffect =
	<T>(effects: TWithExpressEffects<T>) =>
	(a: (...args: any[]) => TExpressEffect): TWithExpressEffects<T> =>
		[effects[0], [...effects[1], a(effects[0])]];

export const addAndApplyEffect = reverseTwo(_addAndApplyEffect);

export const getEffects = <T>(a: TWithExpressEffects<T>): TExpressEffectList =>
	a[1];

export const valFromEffects = <T>(a: TWithExpressEffects<T>): T => a[0];

export const runEffects =
	<T>(req: Request, res: Response, next: NextFunction) =>
	(a: TWithExpressEffects<T>) =>
		a[1].forEach((effect) => effect(req, res, next));

export const setSessionUserEffect =
	(u: TDBUser): TExpressEffect =>
	(req: Request, res: Response) => {
		req.session.user = { ...u, _id: u._id.toHexString() };
	};

export const destroySessionEffect: TExpressEffect = (req, res) =>
	req.session.destroy((e) => {
		throw new Error(e);
	});

export const clientRootRedirectEffect: TExpressEffect = (
	req: Request,
	res: Response
) => res.redirect(CLIENT_ROOT);

export const toErrHandlerEffect =
	<T extends Error>(e: T): TExpressEffect =>
	(req: Request, res: Response, next: NextFunction) =>
		next(e);

export const setStatusEffect =
	(status: number): TExpressEffect =>
	(req: Request, res: Response) =>
		res.status(status);

export const toJSONEffect =
	(data: any): TExpressEffect =>
	(req: Request, res: Response) =>
		res.json(data);

export const setLogFailureMessageEffect =
	(e: BaseError): TExpressEffect =>
	(req) => {
		req.failureMessage = e.message;
	};

// in most or all failure cases, we do the same thing--
// pass to error handler, and set a message on the 'req'
// property for our logger.
export const standardFailureEffects = flow(
	toEffects,
	addAndApplyEffect(toErrHandlerEffect),
	addAndApplyEffect(setLogFailureMessageEffect)
);

export const resEndEffect: TExpressEffect = (req: Request, res: Response) =>
	res.end();
