import { updateUserProfilePreferences } from '../http/updateUserProfilePreferences';
import { map, of, chainFirst } from 'fp-ts/ReaderTaskEither';
import { asks as RTAsks, chain as RTChain } from 'fp-ts/ReaderTask';
import { map as EMap, mapLeft as EMapLeft } from 'fp-ts/Either';
import { TAuthActions } from '../../Auth/state/authStateTypes';
import { IDependencies } from '../../../core/dependencyContext';
import { pipe } from 'fp-ts/lib/function';
import { IUserFacingProfileProps } from '..';
import { userFacingPropsToPreferences } from '../helpers';
import { BaseError } from '../../../core/error';

export const handleUserProfileUpdate = (newPrefs: IUserFacingProfileProps) =>
	pipe(
		of<IDependencies<TAuthActions>, BaseError, IUserFacingProfileProps>(
			newPrefs
		),
		map(userFacingPropsToPreferences),
		chainFirst(updateUserProfilePreferences),
		RTChain((e) =>
			RTAsks(({ dispatch }) =>
				pipe(
					e,
					EMap((a) =>
						dispatch({ type: 'UPDATE_PROFILE_ACTION', payload: a })
					),
					EMapLeft((e) =>
						dispatch({ type: 'ADD_AUTH_ERR', payload: e })
					)
				)
			)
		)
	);
