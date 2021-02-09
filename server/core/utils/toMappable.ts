import { Result, Either } from 'ts-result';

// TODO: error type here is not very meaningful
export const toMappable = <A, B, E extends Error = Error>(
    fn: (a: A) => Either<E, B>
) => (res: Either<E, A>) => (Result.ok(res) ? fn(res.fold()) : res);
