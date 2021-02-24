import { NextFunction, Request, Response } from 'express';
import { runEffects, TWithExpressEffects } from './expressEffects';
import { expectEqual } from './utils/testUtils';

describe('runEffects function', () => {
    it('executes its input functions with correct args', () => {
        const req = ({
            session: {},
        } as unknown) as Request;
        const res = ({
            send: jest.fn(),
        } as unknown) as Response;
        const next = jest.fn() as NextFunction;

        const effects = [
            (a: any) => (a.session.user = 1),
            (a: any, b: any) => b.send('data'),
        ];

        const effectList: TWithExpressEffects<string> = ['irrelevant', effects];

        runEffects(req, res, next)(effectList);

        expectEqual(req.session.user)(1);
        expect(res.send).toHaveBeenCalledWith('data');
    });
});
