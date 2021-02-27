import { Request, Response, NextFunction, RequestHandler } from 'express';

export const authorizeClientController: RequestHandler = (req, res) =>
    res.json(req.session.user);
