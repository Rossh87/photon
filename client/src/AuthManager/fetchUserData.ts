import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { IUser, TAuthActions } from './authTypes';
import { IDispatcher } from '../core/sharedTypes';
import { AuthError } from './AuthErrors';
import { AUTH_API_ENDPOINT } from '../CONSTANTS';
import { Dispatch } from 'react';

const attemptToFetchUserData = (
    fetcher: AxiosInstance
): TE.TaskEither<AuthError, AxiosResponse<IUser>> =>
    TE.tryCatch(
        () => fetcher.get(AUTH_API_ENDPOINT, { withCredentials: true }),
        (reason) => AuthError.create(reason)
    );

const _extractUserData = (response: AxiosResponse<IUser>): IUser =>
    response.data;

const extractUserData = TE.map(_extractUserData);

const initRequest: IDispatcher<TAuthActions> = (dispatch) =>
    dispatch({ type: 'AUTH_REQUEST_INITIATED', data: null });

const onSuccess = (dispatch: Dispatch<TAuthActions>) => (user: IUser) =>
    dispatch({ type: 'ADD_USER', data: user });

const onFailure = (dispatch: Dispatch<TAuthActions>) => (e: AuthError) =>
    dispatch({ type: 'ADD_AUTH_ERR', data: e });

export const _fetchUserData = (fetcher: AxiosInstance) => async (
    dispatch: Dispatch<TAuthActions>
) => {
    initRequest(dispatch);

    return await pipe(
        attemptToFetchUserData(fetcher),
        extractUserData,
        TE.map(onSuccess(dispatch)),
        TE.mapLeft(onFailure(dispatch))
    )();
};

export const fetchUserData = _fetchUserData(axios);
