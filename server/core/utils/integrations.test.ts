import { asyncCompose } from './asyncCompose';
import { toMappable } from './toMappable';
import { Result } from 'ts-result';

describe('composing functions wrapped with toMappable', () => {
    it('preserves correct Either type when all goes well', () => {
        const successfulGetNum = () => Result.right(40);

        const addTwo = (n: number) => Result.right(n + 2);
        const _addTwo = toMappable(addTwo);

        const toString: (n: number) => string = (n) => n.toString();
        const _toString = toMappable(toString);

        const composed = asyncCompose(_toString, _addTwo);
        const input = successfulGetNum();

        expect(composed(input)).toEqual(Result.right('42'));
    });
    it('preserves correct Either type when some operation returns a Left', () => {
        const err = new Error('failed to get a number');
        const input = Result.left(err);

        const addTwo = (n: number) => Result.right(n + 2);
        const _addTwo = toMappable(addTwo);

        const toString: (n: number) => string = (n) => n.toString();
        const _toString = toMappable(toString);

        const composed = asyncCompose(_toString, _addTwo);

        expect(composed(input)).toEqual(Result.left(err));
    });
    it('composes correctly when initial value is not a Result', () => {
        const input = 40;

        const addTwo = (n: number) => n + 2;
        const _addTwo = toMappable(addTwo);

        const composed = asyncCompose(_addTwo);

        expect(composed(input)).toEqual(Result.right(42));
    });
    it('correctly processes asynchronous input', async () => {
        const rejectionErr = new Error('some async problem');
        const validInput = Promise.resolve(40);
        const rejectedInput = Promise.reject(rejectionErr);

        const addTwo = (n: number) => n + 2;
        const _addTwo = toMappable(addTwo);

        const composed = asyncCompose(_addTwo);

        const received = await composed(validInput);
        const receivedRejection = await composed(rejectedInput);

        expect(received).toEqual(Result.right(42));
        expect(receivedRejection).toEqual(Result.left(rejectionErr));
    });

    it('correctly handles async rejection within composition', async () => {
        const rejectionErr = new Error('some async problem');
        const rejection = () => Promise.reject(rejectionErr);

        const addTwo = (n: number) => n + 2;
        const _addTwo = toMappable(addTwo);
        const toString = (n: number) => n.toString();
        const _toString = toMappable(toString);

        const composed = asyncCompose(_toString, rejection, _addTwo);

        const received = await composed(40);

        expect(received).toEqual(Result.left(rejectionErr));
    });
});
