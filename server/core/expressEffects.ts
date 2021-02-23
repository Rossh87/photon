import { Request, Response, NextFunction } from 'express';
import { IUser } from '../modules/User';
import { reverseTwo } from './utils/reverseCurried';

export type TExpressEffectList = Array<TExpressEffect>;

export type TExpressEffect = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;

export type TWithExpressEffects<T> = [T, TExpressEffectList];

export const toEffects = <T>(value: T): TWithExpressEffects<T> => [value, []];

export const _addEffect = <T>(effects: TWithExpressEffects<T>) => (
    a: TExpressEffect
): TWithExpressEffects<T> => [effects[0], [...effects[1], a]];

export const addEffect = reverseTwo(_addEffect);

// similar to addEffect, but instead of accepting an Effect argument,
// it takes a function that returns an Effect and calls it with whatever
// value the EffectList is storing
export const _addAndApplyEffect = <T>(effects: TWithExpressEffects<T>) => (
    a: (...args: any[]) => TExpressEffect
): TWithExpressEffects<T> => [effects[0], [...effects[1], a(effects[0])]];

export const addAndApplyEffect = reverseTwo(_addAndApplyEffect);

export const getEffects = <T>(a: TWithExpressEffects<T>): TExpressEffectList =>
    a[1];

export const valFromEffects = <T>(a: TWithExpressEffects<T>): T => a[0];

export const runEffects = <T>(
    req: Request,
    res: Response,
    next: NextFunction
) => (a: TWithExpressEffects<T>): void =>
    a[1].forEach((effect) => effect(req, res, next));

export const setSessionEffect = (u: IUser): TExpressEffect => (
    req: Request,
    res: Response
) => (req.session.user = u);

export const rootRedirectEffect = (): TExpressEffect => (
    req: Request,
    res: Response
) => res.redirect('/');

export const toErrHandlerEffect = <T extends Error>(e: T): TExpressEffect => (
    req: Request,
    res: Response,
    next: NextFunction
) => next(e);
