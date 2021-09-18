import { RequestHandler } from 'express';
import { LogoutFailureError } from '../domain/LogoutFailureError';

export const logoutController: RequestHandler = (req, res, next) => {
	req.session.destroy((e) =>
		e !== undefined ? next(LogoutFailureError.create(e)) : res.end()
	);
};
