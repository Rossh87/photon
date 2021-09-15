import { flow } from 'fp-ts/lib/function';
import { parseUserPreferences } from '../helpers/parseUserPreferences';
import { updateUserProfilePreferences } from '../repo/updateUserProfilePreferences';
import * as E from 'fp-ts/Either';
import * as RTE from 'fp-ts/ReaderTaskEither';

export const updateProfilePreferences = flow(
    RTE.fromEitherK(parseUserPreferences),
    RTE.chainW(updateUserProfilePreferences)
);
