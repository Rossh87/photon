import { IUser } from '../userTypes';
import {
    getClient,
    _getClient,
    IGetRepoClient,
    TE,
    pipe,
    MongoClient,
    TGetRepoResult,
} from '../../../core/repoClient';
import { BaseError, HTTPErrorTypes } from '../../../core/error';

// TODO: add tests/mock for this(?)
// client curried out for ease of testing/mocking
export const _getUserByID = (getClient: IGetRepoClient) => (id: string) =>
    pipe(
        getClient(),
        TE.map(getUserCollection),
        TE.map((coll) => coll.findOne<IUser>({ OAuthProviderID: id }))
    );

export const getUserByID = _getUserByID(getClient);

const getUserCollection = (client: MongoClient) =>
    pipe(client.db('photon'), (db) => db.collection('users'));

export class MissingCollectionOrDBError extends BaseError {
    public static create(missingCollectionOrDB: string, raw: any) {
        const devMessage = `Database connection failed because the following db or collection was missing: ${missingCollectionOrDB}`;
        return new MissingCollectionOrDBError(devMessage, raw);
    }
    private constructor(devMessage: string, raw: any) {
        super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
    }
}
