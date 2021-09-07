import { flow } from 'fp-ts/lib/function';
import { parseUserProfileData } from '../helpers/parseUserProfileData';
import { updateUserProfilePreferences } from '../repo/updateUserProfilePreferences';
import * as E from 'fp-ts/Either';
import * as RTE from 'fp-ts/ReaderTaskEither';

export const updateProfilePreferences = flow(
	RTE.fromEitherK(parseUserProfileData),
	RTE.chainW(updateUserProfilePreferences)
);
