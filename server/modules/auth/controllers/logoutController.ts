import { RequestHandler } from 'express';
import { pipe } from 'fp-ts/lib/function';
import { fromNullable, map } from 'fp-ts/lib/Option';
import { LogoutFailureError } from '../domain/LogoutFailureError';

export const logoutController: RequestHandler = (req, res, next) => {
	req.session.destroy((e) =>
		e ? next(LogoutFailureError.create(e)) : res.end()
	);
};
