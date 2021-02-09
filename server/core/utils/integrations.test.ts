import { asyncCompose } from './asyncCompose';
import { toMappable } from './toMappable';
import { Result, Either } from 'ts-result';

describe('composing functions wrapped with toMappable', () => {
    it('preserves correct Either type through composition', () => {
        const successfulGetNum = () => Result.right(40);
        const addTwo = (n: number) => Result.right(n + 2);
        const _addTwo = toMappable<>(addTwo);
    });
});
