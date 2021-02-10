import { Result, Either } from 'ts-result';
import { TMapOrChainable, IMappable, IChainable } from './utilTypes';

function isEither<T, E>(v: T | Either<E, T>): v is Either<E, T> {
    return (
        (v as Either<E, T>).isLeft === true ||
        (v as Either<E, T>).isRight === true
    );
}

export const mapOrChain = <A, B, E extends Error = Error>(
    val: A,
    fn: (a: A) => TMapOrChainable<B, E>
) => {
    const result = fn(val);
    // Test result to see if it's a Result wrapper or plain value.
    // If it's a plain value, assume it's valid
    return isEither<B, E>(result) ? result : Result.right(result);
};

// TODO: error type here is not very meaningful.  Any errors we would like
// to pass around MUST extend builtin Error for these types to work correctly
export const toMappable = <A, B, E extends Error = Error>(
    fn: IMappable<A, B> | IChainable<A, B, E>
) => (res: Either<Error, A>) =>
    Result.ok(res) ? mapOrChain(res.fold(), fn) : Result.left(res.fold());
