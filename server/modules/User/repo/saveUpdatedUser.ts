import { TDBUser } from 'sharedTypes/User';
import { MongoClient, Filter, UpdateFilter } from 'mongodb';
import { getCollection, DBError, tryUpdateOne } from '../../../core/repo';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { reverseTwo } from '../../../core/utils/reverseCurried';

export type TUpdateUserResult = TE.TaskEither<DBError, TDBUser>;

// we return the saved user in case we want to send to client or some such
export const saveUpdatedUser =
    (updatedUser: TDBUser) => (repoClient: MongoClient) =>
        pipe(
            repoClient,
            getCollection<TDBUser>('users'),
            tryUpdateOne(getUserFilter(updatedUser))(
                getUpdateUserQuery(updatedUser)
            ),
            TE.map(() => updatedUser)
        );

export const _saveUpdatedUser = reverseTwo(saveUpdatedUser);

// TODO: it may be helpful to abstract these types to reusable types--unclear as of yet
const getUserFilter = (updatedUser: TDBUser): Filter<TDBUser> => ({
    identityProviderID: updatedUser.identityProviderID,
    identityProvider: updatedUser.identityProvider,
});

const getUpdateUserQuery: (updatedUser: TDBUser) => UpdateFilter<TDBUser> = (
    updatedUser
) => ({
    $set: updatedUser,
});
