import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Request, Response, NextFunction } from 'express';

export type TEffectList = NonEmptyArray<TExpressEffect>;

export type TExpressEffect = (
    req: Request,
    res: Response,
    next?: NextFunction
) => void;

export type TWithEffects<T> = [T, TEffectList];

export const runEffects = (
    req: Request,
    res: Response,
    next?: NextFunction
) => (a: TEffectList) =>
    a.forEach((effect) => (next ? effect(req, res, next) : effect(req, res)));
