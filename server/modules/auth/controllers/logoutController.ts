import { RequestHandler } from 'express';
import { BaseError, HTTPErrorTypes } from '../../../core/error';

export const logoutController: RequestHandler = (req, res, next) => {
	req.session.destroy((e) =>
		e !== undefined ? next(LogoutFailureError.create(e)) : res.end()
	);
};

export class LogoutFailureError extends BaseError {
	static create(e: any) {
		const devMessage = `session.destroy failed on logout with the following error: ${e}`;
		return new LogoutFailureError(devMessage, e);
	}
	constructor(devMessage: string, e: any) {
		super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, e);
	}
}
