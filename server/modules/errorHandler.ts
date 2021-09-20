import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { BaseError, HTTPErrorTypes, isBaseError } from '../core/error';
import fs from 'fs';
import path from 'path';

export const errorHandler: ErrorRequestHandler = (
	err: BaseError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// slightly convoluted here due to type guard--essentially, ensure that
	// an err of unknown kind/shape can't take the server down with an invalid property
	// access.
	if (isBaseError(err)) {
		try {
			res.status(err.HTTPErrorType.status).send(
				err.HTTPErrorType.clientMessage
			);
		} catch (e) {
			const { status, clientMessage } =
				HTTPErrorTypes.INTERNAL_SERVER_ERROR;
			res.status(status).send(clientMessage);
		}
	} else {
		const { status, clientMessage } = HTTPErrorTypes.INTERNAL_SERVER_ERROR;
		res.status(status).send(clientMessage);
	}
};
