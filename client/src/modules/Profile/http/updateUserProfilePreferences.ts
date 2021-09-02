import { IUserProfilePreferencesTransportObject } from 'sharedTypes/User';
import {
	IDependencies,
	IHttpCall,
	THTTPRunner,
} from '../../../core/dependencyContext';
import { UPDATE_PROFILE_PREFERENCES_ENDPOINT } from './endpoints';
import { tryCatch } from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { TAuthActions } from '../../Auth/state/authStateTypes';
import { BaseError } from '../../../core/error';

const makeUpdateRequest =
	(newPrefs: IUserProfilePreferencesTransportObject): IHttpCall<void> =>
	(httpLib) =>
		httpLib.put(UPDATE_PROFILE_PREFERENCES_ENDPOINT, newPrefs, {
			withCredentials: true,
		});

export const updateUserProfilePreferences =
	(newPrefs: IUserProfilePreferencesTransportObject) =>
	(deps: IDependencies<TAuthActions>) =>
		tryCatch(
			() => pipe(makeUpdateRequest(newPrefs), deps.http),
			(e) =>
				new BaseError(
					'Attempt to update user profile preferences failed',
					e
				)
		);