import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/function';
import { TAuthorizedUserResponse } from 'sharedTypes/User';
import { IDispatcher } from '../../../core/sharedClientTypes';
import { AuthError } from '../domain/AuthError';
import { AUTH_API_ENDPOINT } from '../../../CONSTANTS';
import { Dispatch } from 'react';
import { TAppAction } from '../../appState/appStateTypes';

const attemptToFetchUserData = (
	fetcher: AxiosInstance
): TE.TaskEither<AuthError, AxiosResponse<TAuthorizedUserResponse>> =>
	TE.tryCatch(
		() => fetcher.get(AUTH_API_ENDPOINT, { withCredentials: true }),
		(reason) => AuthError.create(reason)
	);

const _extractUserData = (
	response: AxiosResponse<TAuthorizedUserResponse>
): TAuthorizedUserResponse => response.data;

const extractUserData = TE.map(_extractUserData);

const initRequest: IDispatcher<TAppAction> = (dispatch) =>
	dispatch({ type: 'AUTH/AUTH_REQUEST_INITIATED', payload: null });

const onSuccess =
	(dispatch: Dispatch<TAppAction>) => (user: TAuthorizedUserResponse) => {
		dispatch({ type: 'AUTH/ADD_USER', payload: user });
	};

const onFailure = (dispatch: Dispatch<TAppAction>) => (e: AuthError) =>
	dispatch({ type: 'AUTH/LOGOUT_USER' });

export const _fetchUserData =
	(fetcher: AxiosInstance) => async (dispatch: Dispatch<TAppAction>) => {
		initRequest(dispatch);

		return await pipe(
			attemptToFetchUserData(fetcher),
			extractUserData,
			TE.map(onSuccess(dispatch)),
			TE.mapLeft(onFailure(dispatch))
		)();
	};

export const fetchUserData = _fetchUserData(axios);
