import { updateUserProfilePreferences } from '../http/updateUserProfilePreferences';
import { map, of, chainFirst } from 'fp-ts/ReaderTaskEither';
import { asks as RTAsks, chain as RTChain } from 'fp-ts/ReaderTask';
import { map as EMap, mapLeft as EMapLeft } from 'fp-ts/Either';
import { IDependencies } from '../../../core/dependencyContext';
import { pipe } from 'fp-ts/lib/function';
import { userFacingPropsToPreferences } from '../helpers';
import { IUserFacingProfileProps } from '../sharedProfileTypes';
import { TAppAction } from '../../appState/appStateTypes';
import { DEFAULT_APP_MESSAGE_TIMEOUT } from '../../../CONSTANTS';
import { PayloadFPReader } from 'react-use-fp';

export const handleUserProfileUpdate: PayloadFPReader<
	TAppAction,
	IUserFacingProfileProps,
	IDependencies<TAppAction>
> = (newPrefs) =>
	pipe(
		of(newPrefs),
		map(userFacingPropsToPreferences),
		chainFirst(updateUserProfilePreferences),
		RTChain((e) =>
			RTAsks(({ dispatch }) =>
				pipe(
					e,
					EMap((a) =>
						dispatch({
							type: 'AUTH/UPDATE_PROFILE_ACTION',
							payload: a,
						})
					),
					EMapLeft((e) =>
						dispatch({
							type: 'META/ADD_APP_MESSAGE',
							payload: {
								messageKind: 'repeat',
								eventName:
									'request to update user profile props rejected',
								displayMessage: e.message,
								severity: 'warning',
								action: {
									handler: () =>
										dispatch({
											type: 'META/REMOVE_APP_MESSAGE',
										}),
									kind: 'simple',
								},
								timeout: DEFAULT_APP_MESSAGE_TIMEOUT,
							},
						})
					)
				)
			)
		)
	);
