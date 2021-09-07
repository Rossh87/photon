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
	res.status(err.HTTPErrorType.status);
	res.send(err.HTTPErrorType.clientMessage);
};
