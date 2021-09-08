import { logoutController, LogoutFailureError } from './logoutController';
import { Request, Response, NextFunction } from 'express';

beforeEach(() => jest.resetAllMocks());

describe('express controller to log a user out', () => {
	it('invokes session.destroy', () => {
		const req = {
			session: {
				destroy: jest.fn((cb) => cb()),
			},
		} as unknown as Request;

		const res = {
			end: jest.fn(),
		} as unknown as Response;

		logoutController(req, res, jest.fn());

		expect(req.session.destroy).toHaveBeenCalledTimes(1);
	});

	it('does not throw if session destruction succeeds', () => {
		const req = {
			session: {
				destroy: jest.fn((cb) => cb()),
			},
		} as unknown as Request;

		const res = {
			end: jest.fn(),
		} as unknown as Response;

		const runController = () => logoutController(req, res, jest.fn());

		expect(runController).not.toThrow();
		expect(req.session.destroy).toHaveBeenCalledTimes(1);
	});

	it('passes error to handler if session destruction fails', () => {
		const failureReason = 'failed';

		const req = {
			session: {
				destroy: jest.fn((cb) => cb(failureReason)),
			},
		} as unknown as Request;

		const res = {
			end: jest.fn(),
		} as unknown as Response;

		const next = jest.fn();

		const expectedErr = LogoutFailureError.create(failureReason);

		logoutController(req, res, next);

		expect(next).toHaveBeenCalledWith(expectedErr);
	});
});
