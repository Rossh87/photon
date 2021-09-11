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
		if (user.accessLevel === 'demo') {
			dispatch({
				type: 'META/ADD_APP_MESSAGE',
				payload: {
					messageKind: 'singleNotice',
					eventName: 'user profile data received',
					displayMessage:
						'Photon is currently running in demo mode.  Demo users are limited to 10 uploads.',
					severity: 'info',
					action: {
						kind: 'simple',
						handler: () =>
							dispatch({ type: 'META/REMOVE_APP_MESSAGE' }),
					},
					displayTrackingProp: 'demoMessageViewed',
				},
			});
		}
		dispatch({ type: 'AUTH/ADD_USER', payload: user });
	};

const onFailure = (dispatch: Dispatch<TAppAction>) => (e: AuthError) =>
	dispatch({ type: 'AUTH/ADD_AUTH_ERR', payload: e });

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
