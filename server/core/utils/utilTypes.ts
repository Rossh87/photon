import { Either, Right } from 'ts-result';

export type TMapOrChainable<T, E> = Either<E, T> | T;
