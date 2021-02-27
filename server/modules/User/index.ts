import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { reverseTwo } from '../../core/utils/reverseCurried';
import { isNonEmptyArray } from '../../core/utils/isNonEmptyArray';
import * as E from 'fp-ts/lib/Either';
import { ObjectID, WithId } from 'mongodb';

type TOAuthProvider = 'google';

export interface IUser extends Record<string, any> {
    OAuthProviderName: TOAuthProvider;
    OAuthProviderID: string;
    thumbnailURL: string;
    displayName: string;
    familyName: string;
    givenName: string;
    OAuthEmail: string;
    OAuthEmailVerified: boolean;
    preferredEmail?: string;
    preferredVerified?: boolean;
}

export interface DBUser extends WithId<IUser> {}

export interface IAuthorizedUserResponse extends Record<string, any> {
    OAuthProviderName: TOAuthProvider;
    _id: string;
    thumbnailURL: string;
    displayName: string;
    familyName: string;
    givenName: string;
    emailAddress: string;
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

export const getUpdatedUser = (dbUser: DBUser) => (resUser: IUser) => {
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

export const getUserOAuthID = (u: IUser | DBUser) => u.OAuthProviderID;

export const toResponseUser: (u: DBUser) => IAuthorizedUserResponse = (u) => {
    const chosenKeys: Array<keyof IUser> = [
        'OAuthProviderName',
        'thumbnailURL',
        'displayName',
        'familyName',
        'givenName',
    ];

    const response: IAuthorizedUserResponse = chosenKeys.reduce<IAuthorizedUserResponse>(
        (res, key) => {
            res[key] = u[key];
            return res;
        },
        {} as IAuthorizedUserResponse
    );

    // need to set emailAddress from preferredEmail or OAuthEmail b/c
    // name of these props changes from client side to server side type
    const email = u.preferredEmail ? u.preferredEmail : u.OAuthEmail;
    response.emailAddress = email;

    // stringify user's object ID for client use
    const _id = u._id.toHexString();
    response._id = _id;

    return response;
};
