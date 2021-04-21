import React from 'react';
import { IDependencies } from './dependencyContext';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { IO } from 'fp-ts/lib/IO';
import { Task } from 'fp-ts/lib/Task';
import { Reader } from 'fp-ts/lib/Reader';
import { ReaderTask } from 'fp-ts/lib/ReaderTask';
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';
import { map as OMap, fromNullable, getOrElseW } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

interface Action {
	type: string;
	data: any;
}

// runners should be pure functions with wrapped void values
interface MiddleWare<A extends Action, T> {
	_tag: A['type'];
	runner: T;
}

export default class MiddleWareRunner<A extends Action, D> {
	private _reactDispatch: React.Dispatch<A>;
	private dependencies: null | D;
	private _io: MiddleWare<A, IO<void>>[];
	private _task: MiddleWare<A, Task<void>>[];
	private _reader: MiddleWare<A, Reader<D, void>>[];
	private _readerTask: MiddleWare<A, ReaderTask<D, void>>[];
	private _readerTaskEither: MiddleWare<A, ReaderTaskEither<D, any, void>>[];

	constructor(dispatch: React.Dispatch<A>) {
		this._reactDispatch = dispatch;
		this.dependencies = null;
		this._io = [];
		this._task = [];
		this._reader = [];
		this._readerTask = [];
		this._readerTaskEither = [];
	}

	rte = (actionTag: A['type']) => <E>(
		RTE: RTE.ReaderTaskEither<D, E, void>
	): void => {
		this._readerTaskEither.push({
			_tag: actionTag,
			runner: RTE,
		});
	};

	initDependencies = (deps: D): void => {
		this.dependencies = deps;
	};

	private runRTE = <E>(mw: MiddleWare<A, RTE.ReaderTaskEither<D, E, void>>) =>
		pipe(
			this.dependencies,
			fromNullable,
			getOrElseW(() => {
				throw new Error('reader middleware dependencies uninitialized');
			}),
			(d) => mw.runner(d)()
		);

	mDispatch = (a: A) => {
		this._readerTaskEither.forEach((mw) => {
			if (mw._tag === a.type) {
				this.runRTE(mw);
			}
		});
	};
}
