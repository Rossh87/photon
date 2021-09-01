import { logoutController, LogoutFailureError } from './logoutController';
import { Request, Response, NextFunction } from 'express';

const res = {
	redirect: jest.fn(),
} as unknown as Response;

const next = jest.fn() as NextFunction;

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

		logoutController(req, res, next);

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

		const runController = () => logoutController(req, res, next);

		expect(runController).not.toThrow();
		expect(req.session.destroy).toHaveBeenCalledTimes(1);
	});

	it('throws if session destruction fails', () => {
		const failureReason = 'failed';

		const req = {
			session: {
				destroy: jest.fn((cb) => cb(new Error(failureReason))),
			},
		} as unknown as Request;

		const res = {
			end: jest.fn(),
		} as unknown as Response;

		const expectedErr = LogoutFailureError.create(failureReason);

		const runController = () => logoutController(req, res, next);

		expect(runController).toThrowError(expectedErr);
	});
});
