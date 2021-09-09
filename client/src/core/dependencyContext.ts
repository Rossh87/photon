import React, { Dispatch } from 'react';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { resizeImage } from '../modules/Uploader/useCases/resizeImage';

export interface IHttpCall<T> {
	(httpLib: AxiosInstance): Promise<AxiosResponse<T>>;
}

export type THTTPRunner = <T>(fn: IHttpCall<T>) => Promise<AxiosResponse<T>>;

export type TImageResizer = typeof resizeImage;

export interface IDependencies<A> {
	http: THTTPRunner;
	dispatch: Dispatch<A>;
	imageReducer: TImageResizer;
}

export type WithAddedDependencies<A, D> = IDependencies<A> & D;

export interface IDispatchInjector<T> {
	(d: Dispatch<T>): IDependencies<T>;
}

export interface IHTTPLib extends AxiosInstance {}

const makeHttpRunner =
	(httpLib: IHTTPLib) =>
	<T>(fn: IHttpCall<T>) =>
		fn(httpLib);

export const createDependenciesObject =
	(a: IHTTPLib) =>
	(b: TImageResizer) =>
	<T>(c: Dispatch<T>): IDependencies<T> => ({
		http: makeHttpRunner(a),
		imageReducer: b,
		dispatch: c,
	});

export const addSecondaryDispatch =
	<D>(secondaryDispatch: Dispatch<D>) =>
	<A>(creatorFN: (d: Dispatch<A>) => IDependencies<A>) =>
	(dispatch: Dispatch<A>) => ({
		...creatorFN(dispatch),
		secondaryDispatch,
	});

// represents 'real' dependencies, to be swapped out for mocks/stubs in tests
export const liveDependencies = createDependenciesObject(axios)(resizeImage);

// TODO: not an ideal place for this
export const extractResponseData = <T>(res: Promise<AxiosResponse<T>>) =>
	res.then((res) => res.data);

export default React.createContext(liveDependencies);
