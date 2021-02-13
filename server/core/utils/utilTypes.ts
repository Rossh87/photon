import { Either } from 'ts-result';

export type TMapOrChainable<T, E> = Either<E, T> | T;

export interface IMappable<A, B> {
    (a: A): B;
}

export interface IChainable<A, B, E extends Error = Error> {
    (a: A): Either<E, B>;
}

export interface IComposition<A, B, E extends Error = Error> {
    (fns: Array<IMappable<any, E> | IChainable<any, E>>): (
        a: A | Either<E, A>
    ) => Either<E, B>;
}

export interface IWrapAndCompose<A, B, E extends Error = Error> {
    (...fns: any): (a: A | Either<E, A>) => Either<E, B>;
}
