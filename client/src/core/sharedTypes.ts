import { Dispatch } from 'react';
import * as TE from 'fp-ts/lib/TaskEither';

export interface IDispatcher<A, B = void> {
    (d: Dispatch<A>): B;
}

export interface ITEDispatcher<E, A, B, C = void> {
    (d: Dispatch<A>): (t: TE.TaskEither<E, B>) => C;
}