import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { IAuthorizedUserResponse } from '../domain/authDomainTypes';
import { TAuthActions } from '../state/authStateTypes';
import { IDispatcher } from '../../../core/sharedClientTypes';
import { AuthError } from '../domain/AuthError';
import { AUTH_API_ENDPOINT } from '../../../CONSTANTS';
import { Dispatch } from 'react';

const attemptToFetchUserData = (
	fetcher: AxiosInstance
): TE.TaskEither<AuthError, AxiosResponse<IAuthorizedUserResponse>> =>
	TE.tryCatch(
		() => fetcher.get(AUTH_API_ENDPOINT, { withCredentials: true }),
		(reason) => AuthError.create(reason)
	);

const _extractUserData = (
	response: AxiosResponse<IAuthorizedUserResponse>
): IAuthorizedUserResponse => response.data;

const extractUserData = TE.map(_extractUserData);

const initRequest: IDispatcher<TAuthActions> = (dispatch) =>
	dispatch({ type: 'AUTH_REQUEST_INITIATED', payload: null });

const onSuccess =
	(dispatch: Dispatch<TAuthActions>) => (user: IAuthorizedUserResponse) =>
		dispatch({ type: 'ADD_USER', payload: user });

const onFailure = (dispatch: Dispatch<TAuthActions>) => (e: AuthError) =>
	dispatch({ type: 'ADD_AUTH_ERR', payload: e });

export const _fetchUserData =
	(fetcher: AxiosInstance) => async (dispatch: Dispatch<TAuthActions>) => {
		initRequest(dispatch);

		return await pipe(
			attemptToFetchUserData(fetcher),
			extractUserData,
			TE.map(onSuccess(dispatch)),
			TE.mapLeft(onFailure(dispatch))
		)();
	};

export const fetchUserData = _fetchUserData(axios);
