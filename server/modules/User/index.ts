import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { reverseTwo } from '../../core/utils/reverseCurried';
import { isNonEmptyArray } from '../../core/utils/isNonEmptyArray';
import * as E from 'fp-ts/lib/Either';
import { ObjectID } from 'mongodb';

type TOAuthProvider = 'google';

export interface IUser {
    OAuthProviderName: TOAuthProvider;
    // we specify for possible future need
    OAuthProviderID: string;
    localAppID?: string;
    thumbnailURL: string;
    displayName: string;
    familyName: string;
    givenName: string;
    OAuthEmail: string;
    OAuthEmailVerified: boolean;
    // local option for user to specify different email
    preferredEmail?: string;
    preferredVerified?: boolean;
    _id?: ObjectID;
}

export type TChangeableUserProps =
    | 'thumbnailURL'
    | 'thumbnailURL'
    | 'displayName'
    | 'familyName'
    | 'givenName'
    | 'OAuthEmail'
    | 'OAuthEmailVerified';

type TPropTuple = [keyof IUser, string | boolean];

export const getUpdatedUser = (dbUser: IUser) => (resUser: IUser) => {
    const maybeChanged: Array<TChangeableUserProps> = [
        'thumbnailURL',
        'thumbnailURL',
        'displayName',
        'familyName',
        'givenName',
        'OAuthEmail',
        'OAuthEmailVerified',
    ];

    // group any needed updates from fresh data into an array of key/value tuples
    // so we can easily check the length and know if we need to trigger a database
    // update or not
    const updates: Array<TPropTuple> = maybeChanged.reduce<any>(
        (updated, prop: TChangeableUserProps) =>
            resUser[prop] !== dbUser[prop]
                ? [...updated, [prop, resUser[prop]]]
                : updated,
        []
    );

    // if updates needed, convert updates array into an object to use
    // as Mongo update query
    const updatesToObject = (updates: NonEmptyArray<TPropTuple>) =>
        updates.reduce<Partial<IUser>>((updated, update) => {
            const [key, val] = update;
            (updated[key] as string | boolean) = val;
            return updated;
        }, {});

    // Return an Either<existingUser | updates>
    return isNonEmptyArray<TPropTuple>(updates)
        ? E.right(Object.assign(dbUser, updatesToObject(updates)))
        : E.left(dbUser);
};

export const _getUpdatedUser = reverseTwo(getUpdatedUser);

export const getUserOAuthID = (u: IUser) => u.OAuthProviderID;
