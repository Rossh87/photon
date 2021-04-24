import React, { useReducer, Dispatch, ReducerAction, Reducer } from 'react';
import { fromPredicate, map, fromNullable, fold } from 'fp-ts/lib/Option';
import { pipe, flow } from 'fp-ts/lib/function';
import { Reader } from 'fp-ts/lib/Reader';

// Reader dependency types:
interface DependencyObject<A> {
	dispatch: React.Dispatch<A>;
}

export interface DependencyCreator<A, D = {}> {
	(dispatch: React.Dispatch<A>): MergedDependencies<A, D>;
}

type MergedDependencies<A, D> = DependencyObject<A> & D;

type ReaderDependencies<A, D> = MergedDependencies<A, D> | Dispatch<A>;

// handler types:
export type ActionHandler = <A, D, FB>(d: ReaderDependencies<A, D>) => FB;

export type PayloadHandler = <P, A, D, FB>(
	p: P
) => Reader<ReaderDependencies<A, D>, FB>;

interface ActionReceiver<A, D, FB, P> {
	type: string;
	handler: any;
	makeDependencies?: DependencyCreator<A, D>;
}

interface Action<T, S extends string> {
	type: S;
	payload?: T;
}

interface Composable<A> {
	(dispatch: Dispatch<A>): (next: (a: A) => void) => (action: A) => void;
}
