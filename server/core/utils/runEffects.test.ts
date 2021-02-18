import { runEffects } from './runEffects';
import { TEffectList } from '../coreTypes';
import { expectEqual } from './testUtils';

describe('runEffects function', () => {
    it('executes its input functions with correct args', () => {
        const req = {} as any;
        const res = ({
            send: jest.fn(),
        } as unknown) as any;

        const effects = [
            (a: any) => (a.function1 = 1),
            (a: any, b: any) => b.send('data'),
        ];

        runEffects(req, res)(effects as TEffectList);

        expectEqual(req.function1)(1);
        expect(res.send).toHaveBeenCalledWith('data');
    });
});
