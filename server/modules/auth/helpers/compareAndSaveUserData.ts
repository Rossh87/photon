import { IUser } from '../../User/userTypes';
import * as TE from 'fp-ts/lib/TaskEither';
import { MongoClient } from 'mongodb';
import { DBWriteError } from '../../../core/repo';
import { pipe } from 'fp-ts/lib/function';
import { getUserByID } from '../../User/repo/getUserByID';

export type TCompareAndSaveUserResult = TE.TaskEither<DBWriteError, IUser>;

interface ICompareAndSaveUserData {
    (resUser: IUser): (repoClient: MongoClient) => TCompareAndSaveUserResult;
}

export const compareAndSaveUserData: ICompareAndSaveUserData = (resUser) => (
    repoClient
) => pipe(
    resUser,
    (ru => getUserByID(ru.OAuthProviderID)(repoClient)),
    TE.map(dbUser => )
);

interface IDBUserSome {
    (dbUser: IUser): (resUser: IUser) => (repoClient: MongoClient) =>  TCompareAndSaveUserResult
}

// TODO: this could be broken into more pieces...
const dbUserSome: IDBUserSome = (dbUser) => (resUser) => (repoClient) => {
    const maybeChanged: Array<keyof IUser> = ['thumbnailURL', 'thumbnailURL', 'displayName', 'familyName', 'givenName', 'OAuthEmail', 'OAuthEmailVerified'];
    
    const updates = maybeChanged.reduce<Partial<IUser>>((updated, prop) => {
        if(resUser[prop] !== dbUser[prop]){

        }
    },{})
}