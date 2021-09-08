import { Request, Response, NextFunction, RequestHandler } from 'express';
import { TSessionUser } from '../../../../sharedTypes/User';
import { formatUserForClient } from '../../User/helpers/formatUserForClient';

export const authorizeClientController: RequestHandler = (req, res) =>
	// OK to cast this behind authGate
	res.json(formatUserForClient(req.session.user as TSessionUser));
