import { Result, Either, Left } from 'ts-result';
import { toMappable } from './toMappable';

describe('the utility function toMappable', () => {
    it('does not call wrapped function if it receives a Left argument, and passes the Left argument through', () => {
        const argFn = jest.fn();
        const wrapped = toMappable(argFn);
        const err = new Error('some message');
        const leftArgument = Result.left(err);

        const result = wrapped(leftArgument);

        expect(argFn).not.toHaveBeenCalled();
        expect(result).toEqual(leftArgument);
    });

    it('unwraps a Right argument and passes its value to the wrapped function, and returns a new Right', () => {
        const meaningError = new Error(
            'received number that is not the meaning'
        );
        const argFn: (n: number) => Either<Error, boolean> = (n) =>
            n === 42 ? Result.right(true) : Result.left(meaningError);

        const wrapped = toMappable(argFn);
        const rightArgument1 = Result.right(42);
        const rightArgument2 = Result.right(10);

        const result1 = wrapped(rightArgument1);
        const result2 = wrapped(rightArgument2);

        expect(result1).toEqual(Result.right(true));
        expect(result2).toEqual(Result.left(meaningError));
    });

    it('correctly re-wraps the return value of passed-in function if that function returns a plain value, not an Either', () => {
        const meaningError = new Error(
            'received number that is not the meaning'
        );
        const rightArgument = Result.right(42);
        const leftArgument = Result.left(meaningError);

        const addTwo: (n: number) => number = (n) => n + 2;
        const wrapped = toMappable(addTwo);

        const rightResult = wrapped(rightArgument);
        const leftResult = wrapped(leftArgument);

        expect(rightResult).toEqual(Result.right(44));
        expect(leftResult).toEqual(Result.left(meaningError));
    });
    it('correctly applies wrapped function to input params that are not of type Either', () => {
        const plainInput = 40;

        const addTwo: (n: number) => number = (n) => n + 2;
        const wrapped = toMappable(addTwo);

        expect(wrapped(plainInput)).toEqual(Result.right(42));
    });
});
