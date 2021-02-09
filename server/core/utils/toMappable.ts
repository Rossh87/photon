import { Result, Either } from 'ts-result';
import { TMapOrChainable } from './utilTypes';

export const isResult: (v: any) => v is Result = 

export const mapOrChain = <A, B, E extends Error = Error>(
    val: A,
    fn: (a: A) => TMapOrChainable<B, E>
) => {
    const result = fn(val);
    // test result to see if it's a Result wrapper or plain value
    // if it's a plain value, assume it's valid
    return typeof result === 'object' && (result.isRight  || result.isLeft)
        ? result
        : Result.right(result);
};

// TODO: error type here is not very meaningful
export const toMappable = <A, B, E extends Error = Error>(
    fn: (a: A) => Either<E, B>
) => (res: Either<E, A>) => (Result.ok(res) ? fn(res.fold()) : res);
