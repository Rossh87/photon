import { authorizeClientController } from '.';
import { toSessionUser } from '../../../core/utils/toSessionUser';
import { mockUserFromDatabase } from '../helpers/mockData';
import { Request, Response } from 'express';

describe('controller to send user profile data to client', () => {
	it('adds user creation timestamp based on mongo id', () => {
		const usr = toSessionUser(mockUserFromDatabase);

		const req = {
			session: {
				user: usr,
			},
		} as unknown as Request;

		const res = {
			json: jest.fn(),
		} as unknown as Response;

		authorizeClientController(req, res, jest.fn());

		const expectedTimestamp = mockUserFromDatabase._id
			.getTimestamp()
			.toJSON();

		expect(res.json).toHaveBeenCalledWith({
			...usr,
			createdAt: expectedTimestamp,
		});
	});
});
