import {
    getClient,
    _getClient,
    IGetRepoClient,
    TE,
    pipe,
    MongoClient,
    TGetRepoResult,
} from '../../core/repoClient';
import { IUser } from './userTypes';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';

export const _mergeInboundUser = (getClient: IGetRepoClient) => (
    incomingUser: IUser
) => pipe();
