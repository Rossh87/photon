import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Request, Response, NextFunction } from 'express';

export type TEffectList = NonEmptyArray<TExpressEffect>;

export type TExpressEffect = (
    req: Request,
    res: Response,
    next?: NextFunction
) => void;
