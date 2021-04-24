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
	runner: (...args: any[]) => T;
}

export default class MiddleWareRunner<A extends Action, D> {
	private _reactDispatch: React.Dispatch<A>;
	private dependencies: null | D;
	private _io: MiddleWare<A, IO<void>>[];
	private _task: MiddleWare<A, Task<void>>[];
	private _reader: MiddleWare<A, Reader<D, void>>[];
	private _readerTask: MiddleWare<A, ReaderTask<D, void>>[];

	constructor(dispatch: React.Dispatch<A>) {
		this._reactDispatch = dispatch;
		this.dependencies = null;
		this._io = [];
		this._task = [];
		this._reader = [];
		this._readerTask = [];
	}

	addRT = (actionTag: A['type']) => <E>(
		RTE: (...args: any[]) => any
	): any => {
		this._readerTask.push({
			_tag: actionTag,
			runner: RTE,
		});
	};

	initDependencies = (deps: D): void => {
		this.dependencies = deps;
	};

	private runRT = <E, B>(arg: B) => (
		mw: MiddleWare<A, ReaderTask<D, void>>
	) => {
		pipe(
			this.dependencies,
			fromNullable,
			getOrElseW(() => {
				throw new Error('reader middleware dependencies uninitialized');
			}),
			(d) => mw.runner(arg)(d)()
		);
	};

	mDispatch = (a: A) => {
		this._readerTask.forEach((mw) => {
			if (mw._tag === a.type) {
				this.runRT(a.data)(mw);
			}
		});

		this._reactDispatch(a);
	};
}
