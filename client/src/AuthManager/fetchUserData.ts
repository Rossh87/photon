import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { IUser } from './types';
import { AuthError } from './AuthErrors';
import { AUTH_API_ENDPOINT } from '../../CONSTANTS';

const attemptToFetchUserData = (
    fetcher: AxiosInstance
): TE.TaskEither<AuthError, AxiosResponse<IUser>> =>
    TE.tryCatch(
        () => fetcher.get(AUTH_API_ENDPOINT),
        (reason) => AuthError.create(reason)
    );

const _extractUserData = (userData: AxiosResponse<IUser>): IUser =>
    userData.data;

const extractUserData = TE.map(_extractUserData);

export const _fetchUserData = (fetcher: AxiosInstance) =>
    pipe(attemptToFetchUserData(fetcher), extractUserData);

export const fetchUserData = _fetchUserData(axios);
