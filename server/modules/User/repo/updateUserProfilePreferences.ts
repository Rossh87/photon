import { TDBUser } from 'sharedTypes/User';
import { MongoClient, ObjectId } from 'mongodb';
import { getCollection, tryUpdateOne } from '../../../core/repo';
import { pipe } from 'fp-ts/lib/function';
import { IProfilePrefsUpdateObject } from '../sharedUserTypes';
import { IAsyncDeps } from '../../../core/asyncDeps';
import { UserPreferenceProperties } from '../helpers/parseUserPreferences';

// we return the saved user in case we want to send to client or some such
export const updateUserProfilePreferences =
    ({ preferences, ownerID }: UserPreferenceProperties) =>
    ({ repoClient }: IAsyncDeps) =>
        pipe(
            repoClient,
            getCollection<TDBUser>('users'),
            tryUpdateOne<TDBUser>({ _id: new ObjectId(ownerID) })({
                $set: { userPreferences: preferences },
            })
        );
