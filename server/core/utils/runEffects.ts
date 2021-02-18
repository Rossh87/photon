import { Request, Response, NextFunction } from 'express';
import { TEffectList } from '../coreTypes';

export const runEffects = (
    req: Request,
    res: Response,
    next?: NextFunction
) => (a: TEffectList) =>
    a.forEach((effect) => (next ? effect(req, res, next) : effect(req, res)));
