import { Request, Response, NextFunction, RequestHandler } from 'express';

export const authGate: RequestHandler = (req, res, next) =>
	req.session.user ? next() : res.status(401).end();
