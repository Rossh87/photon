import { IFetcher } from './fetcher';
import { MongoClient } from 'mongodb';

export const getFetcher = (deps: IAsyncDeps) => deps.fetcher;

export const getRepo = (deps: IAsyncDeps) => deps.repoClient;

export interface IAsyncDeps {
    repoClient: MongoClient;
    fetcher: IFetcher;
}
