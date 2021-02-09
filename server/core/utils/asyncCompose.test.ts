import { asyncCompose } from './asyncCompose';

describe('a composer for async functions', () => {
    it('composes two or more functions', () => {
        const getNum = () => 10;
        const addTwo = (n: number) => n + 2;

        const composed = asyncCompose(addTwo, getNum);
        expect(composed()).toEqual(12);
    });

    it('can compose async and synchronous functions', async () => {
        const asyncGetNum = () => Promise.resolve(10);
        const syncAddTwo = (n: number) => n + 2;

        const composed = asyncCompose(syncAddTwo, asyncGetNum);
        const received = await composed();
        expect(received).toEqual(12);
    });
});
