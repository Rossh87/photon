import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export const isNonEmptyArray = function isNonEmptyArray<T>(
    a: Array<T>
): a is NonEmptyArray<T> {
    return a.length !== 0;
};
