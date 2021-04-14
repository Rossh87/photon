import React, { Dispatch } from 'react';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { resizeImage } from './imageReducer';

export interface IHttpCall<T> {
	(httpLib: AxiosInstance): Promise<AxiosResponse<T>>;
}

export interface IDependencies<A> {
	http: <T>(fn: IHttpCall<T>) => Promise<AxiosResponse<T>>;
	dispatch: Dispatch<A>;
	imageReducer: typeof resizeImage;
}

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

export const liveValues = createDependenciesObject(axios)(resizeImage);

const DependencyContext = React.createContext({});
