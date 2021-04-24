import React, { useReducer, Dispatch, ReducerAction, Reducer } from 'react';
import { fromPredicate, map, fromNullable, fold } from 'fp-ts/lib/Option';
import { pipe, flow } from 'fp-ts/lib/function';
import { Reader } from 'fp-ts/lib/Reader';

interface DependencyObject<A> {
	dispatch: React.Dispatch<A>;
}

type MergedDependencies<A, D> = DependencyObject<A> & D;

type ReaderDependencies<A, D> = MergedDependencies<A, D> | React.Dispatch<A>

export interface DependencyCreator<A, D = {}> {
	(dispatch: React.Dispatch<A>): MergedDependencies<A, D>;
}

interface ActionReceiver<A, D> {
	type: string;
	handler: <P, FB>(p: P) => Reader<ReaderDependencies<A, D>, FB> | 
	makeDependencies?: DependencyCreator<A, D>;
}

interface Action<T, S extends string> {
	type: S;
	payload?: T;
}

export type ActionHandler<A, FB> = Reader<Dispatch<A>, FB>;

export type PayloadHandler = 

interface Composable<A> {
	(dispatch: Dispatch<A>): (next: (a: A) => void) => (action: A) => void;
}

export const useFPMiddleware = <S, A extends Action<any, any>, D>(
	r: React.Reducer<S, A>,
	initialState: S
) => {
	const [state, baseDispatch] = useReducer<React.Reducer<S, A>>(
		r,
		initialState
	);

	const callHandler = (receiver: ActionReceiver<A, D>) => (
		dispatch: Dispatch<A>
	) =>
		pipe(
			receiver.makeDependencies,
			fromNullable,
			fold(
				() => receiver.handler(dispatch)(),
				(dependencyCreator) =>
					receiver.handler(dependencyCreator(dispatch))()
			)
		);

	const callHandlerWithPayload = (receiver: ActionReceiver<A>) => (
		dispatch: Dispatch<A>
	) => (payload: any) =>
		pipe(
			receiver.makeDependencies,
			fromNullable,
			fold(
				() => receiver.handler(payload)(dispatch)(),
				(dependencyCreator) =>
					receiver.handler(payload)(dependencyCreator(dispatch))()
			)
		);

	const toComposable = (receiver: ActionReceiver<A>) => (
		dispatch: Dispatch<A>
	) => (next: (a: A) => void) => (action: A) => {
		pipe(
			action,
			fromPredicate((t) => t.type === receiver.type),
			map(
				flow(
					(a) => a.payload,
					fromNullable,
					fold(
						() => callHandler(receiver)(dispatch),
						(payload) =>
							callHandlerWithPayload(receiver)(dispatch)(payload)
					)
				)
			)
		);

		return next(action);
	};

	const handlers: Composable<A>[] = [];

	const addHandler = (type: A['type']) => (
		handler: any,
		makeDependencies?: DependencyCreator<A, D>
	) =>
		handlers.push(
			toComposable({
				type,
				handler,
				makeDependencies,
			})
		);

	const dispatch = (action: A) =>
		handlers.reduceRight(
			(next, fn) => fn(baseDispatch)(next),
			baseDispatch
		)(action);

	return [state, dispatch, addHandler];
};
