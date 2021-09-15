import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { BaseError } from '../core/error';
import fs from 'fs';
import path from 'path';

export const errorHandler: ErrorRequestHandler = (
	err: BaseError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const message = err.clientMessage
		? err.clientMessage
		: err.HTTPErrorType.clientMessage;
	res.status(err.HTTPErrorType.status);
	res.send(message);
};
