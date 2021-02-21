import { IFetcher } from './fetcher';
import { MongoClient } from 'mongodb';
import { asks } from 'fp-ts/lib/Reader';
import { flow } from 'fp-ts/lib/function';

export const getFetcher = (deps: IAsyncDeps) => deps.fetcher;

export const getRepo = (deps: IAsyncDeps) => deps.repoClient;

export interface IAsyncDeps {
    repoClient: MongoClient;
    fetcher: IFetcher;
}

// TODO: these aren't type safe.
export const askForFetch = <A, B, F extends Function>(fn: F) => (a: A) =>
    asks<IAsyncDeps, B>(flow(getFetcher, fn(a)));

export const askForRepo = <A, B, F extends Function>(fn: F) => (a: A) =>
    asks<IAsyncDeps, B>(flow(getRepo, fn(a)));
