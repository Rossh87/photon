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

export interface IDispatchInjector<T> {
	(d: Dispatch<T>): IDependencies<T>;
}

export interface IHTTPLib extends AxiosInstance {}

export type TResizer = typeof resizeImage;

const makeHttpRunner = (httpLib: AxiosInstance) => <T>(fn: IHttpCall<T>) =>
	fn(httpLib);

export const createDependenciesObject = (a: AxiosInstance) => (b: TResizer) => <
	T
>(
	c: Dispatch<T>
): IDependencies<T> => ({
	http: makeHttpRunner(a),
	imageReducer: b,
	dispatch: c,
});

export const liveDependencies: IDispatchInjector<any> = createDependenciesObject(
	axios
)(resizeImage);

// TODO: not an ideal place for this
export const extractResponseData = <T>(res: Promise<AxiosResponse<T>>) =>
	res.then((res) => res.data);

export default React.createContext(liveDependencies);
