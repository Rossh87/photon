import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { TAuthorizedUserResponse } from 'sharedTypes/User';
import { TAuthActions } from '../state/authStateTypes';
import { IDispatcher } from '../../../core/sharedClientTypes';
import { AuthError } from '../domain/AuthError';
import { AUTH_API_ENDPOINT } from '../../../CONSTANTS';
import { Dispatch } from 'react';
import { createAppMessage } from '../../AppMessages/helpers';

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

const initRequest: IDispatcher<TAuthActions> = (dispatch) =>
	dispatch({ type: 'AUTH_REQUEST_INITIATED', payload: null });

const onSuccess =
	(dispatch: Dispatch<TAuthActions>) => (user: TAuthorizedUserResponse) => {
		if (user.accessLevel === 'demo') {
			dispatch({
				type: 'ADD_APP_MESSAGE',
				payload: createAppMessage(
					'Photon is currently running in demo mode.  Demo users are limited to 10 uploads.',
					'info',
					false
				),
			});
		}
		dispatch({ type: 'ADD_USER', payload: user });
	};

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
