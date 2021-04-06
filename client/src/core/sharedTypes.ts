import { Dispatch } from 'react';
import * as TE from 'fp-ts/lib/TaskEither';
import { AxiosInstance } from 'axios';
import { resizeImage as imageReducer, resizeImage } from '../core/imageReducer';

export interface IDispatcher<A, B = void> {
	(d: Dispatch<A>): B;
}

export interface ITEDispatcher<E, A, B, C = void> {
	(d: Dispatch<A>): (t: TE.TaskEither<E, B>) => C;
}

export interface IFetcher extends AxiosInstance {}

export interface IAsyncDependencies<T = { type: string; data: any }> {
	fetcher: IFetcher;
	dispatch: Dispatch<T>;
	imageReducer: typeof resizeImage;
}
