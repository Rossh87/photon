import { Request, Response, NextFunction } from 'express';

export type TExpressEffectList = Array<TExpressEffect>;

export type TExpressEffect = (
    req: Request,
    res: Response,
    next?: NextFunction
) => void;

export type TWithExpressEffects<T> = [T, TExpressEffectList];

export const addEffect = <T>(effects: TWithExpressEffects<T>) => (
    a: TExpressEffect
): TWithExpressEffects<T> => [effects[0], [...effects[1], a]];

export const getEffects = <T>(a: TWithExpressEffects<T>): TExpressEffectList =>
    a[1];

export const valFromEffects = <T>(a: TWithExpressEffects<T>): T => a[0];

export const runEffects = (
    req: Request,
    res: Response,
    next?: NextFunction
) => (a: TExpressEffectList): void =>
    a.forEach((effect) => (next ? effect(req, res, next) : effect(req, res)));
