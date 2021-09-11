import { IUserProfilePreferencesTransportObject } from 'sharedTypes/User';
import {
	IDependencies,
	IHttpCall,
	THTTPRunner,
} from '../../../core/dependencyContext';
import { UPDATE_PROFILE_PREFERENCES_ENDPOINT } from './endpoints';
import { tryCatch } from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { BaseError } from '../../../core/error';
import { TAuthActions } from '../../Auth/state/authStateTypes';
import { TAppAction } from '../../appState/appStateTypes';

const makeUpdateRequest =
	(newPrefs: IUserProfilePreferencesTransportObject): IHttpCall<void> =>
	(httpLib) =>
		httpLib.put(UPDATE_PROFILE_PREFERENCES_ENDPOINT, newPrefs, {
			withCredentials: true,
		});

export const updateUserProfilePreferences =
	(newPrefs: IUserProfilePreferencesTransportObject) =>
	(deps: IDependencies<TAppAction>) =>
		tryCatch(
			() => pipe(makeUpdateRequest(newPrefs), deps.http),
			(e) => {
				return new BaseError(
					'Attempt to update user profile preferences failed',
					e
				);
			}
		);
