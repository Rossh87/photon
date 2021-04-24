import React, { useReducer, Dispatch } from 'react';
import { ReaderTask } from 'fp-ts/lib/ReaderTask';
import { fromPredicate, map, fromNullable, fold } from 'fp-ts/lib/Option';
import { pipe, flow } from 'fp-ts/lib/function';
import { IO } from 'fp-ts/lib/IO';
import { map as EMap, left, mapLeft as EMapLeft } from 'fp-ts/lib/Either';

type HandlerKind = 'readertask' | 'task' | 'io' | 'reader';

interface Dependencies<A> {
	dispatch: React.Dispatch<A>;
}

interface DispatchInjector<A, D extends Dependencies<A> = Dependencies<A>> {
	(dispatch: React.Dispatch<A>): D;
}

interface Action {
	type: string;
	data?: any;
}

interface ActionReceiver {
	type: string;
	handler: any;
}

export const useFPMiddleware = <S, A extends Action>(
	r: React.Reducer<S, A>,
	initialState: S,
	dependencies?: DispatchInjector<A>
): [S, React.Dispatch<A>, (s: string) => (h: Function) => void] => {
	const [state, baseDispatch] = useReducer<React.Reducer<S, A>>(
		r,
		initialState
	);

	const deps = dependencies ? dependencies(baseDispatch) : baseDispatch;

	const handlers: ActionReceiver[] = [];

	const addHandler = (type: A['type']) => <F>(handler: F) =>
		handlers.push({
			type,
			handler,
		});

	const dispatch = (a: A) => {
		handlers.forEach((receiver) => {
			pipe(
				a,
				fromPredicate((t) => t.type === receiver.type),
				map(
					flow(
						(a) => a.data,
						fromNullable,
						fold(
							() => receiver.handler(deps)(),
							(data) => receiver.handler(data)(deps)()
						)
					)
				)
			);
		});

		baseDispatch(a);
	};

	return [state, dispatch, addHandler];
};
