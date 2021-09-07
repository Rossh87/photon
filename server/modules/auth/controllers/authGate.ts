import { Request, Response, NextFunction, RequestHandler } from 'express';

export const authGate: RequestHandler = (req, res, next) => {
	if (req.session.user !== undefined) next();
	else {
		req.failureMessage =
			'Attempt to access protected resource by unauthenticated user';
		res.status(401).end();
	}
};
