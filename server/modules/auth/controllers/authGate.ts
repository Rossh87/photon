import { Request, Response, NextFunction, RequestHandler } from 'express';
import { BaseError, HTTPErrorTypes } from '../../../core/error';

export const authGate: RequestHandler = (req, res, next) => {
	if (req.session.user !== undefined) next();
	else {
		req.failureMessage = new BaseError(
			'Attempt to access protected resource by unauthenticated user',
			HTTPErrorTypes.UNAUTHORIZED
		);
		res.status(401).send('authGate');
	}
};
