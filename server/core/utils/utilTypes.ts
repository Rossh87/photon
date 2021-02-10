import { Either } from 'ts-result';

export type TMapOrChainable<T, E> = Either<E, T> | T;

export interface IMappable<A, B> {
    (a: A): B;
}

export interface IChainable<A, B, E extends Error = Error> {
    (a: A): Either<E, B>;
}
