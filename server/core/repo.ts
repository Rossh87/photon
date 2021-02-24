import {
    MongoClient,
    RootQuerySelector,
    Collection,
    OptionalId,
    FilterQuery,
    UpdateQuery,
} from 'mongodb';
import { BaseError, HTTPErrorTypes, HTTPErrorType } from './error';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';
import { reverseTwo } from './utils/reverseCurried';

export const getCollection = <T>(collection: string) => (client: MongoClient) =>
    client.db('photon').collection<T>(collection);

export const _getCollection = reverseTwo(getCollection);

export const trySaveOne = <T>(document: OptionalId<T>) => (c: Collection<T>) =>
    TE.tryCatch(
        pipe(
            () => c.insertOne(document),
            T.map((writeResult) => writeResult.ops[0])
        ),
        (reason) => DBWriteError.create(c.collectionName, document, reason)
    );

export const _trySaveOne = reverseTwo(trySaveOne);

export const tryUpdateOne = <T>(filter: FilterQuery<T>) => (
    updateQuery: UpdateQuery<T>
) => (c: Collection<T>) =>
    TE.tryCatch(
        () => c.updateOne(filter, updateQuery),
        (reason) => DBUpdateError.create(c.collectionName, filter, reason)
    );

// Error classes
export class MongoConnectionError extends BaseError {
    public static create(uri: string, e?: any) {
        const devMessage = `Mongo client was unable to connect to database at the following location: ${uri}`;
        return new MongoConnectionError(
            devMessage,
            HTTPErrorTypes.INTERNAL_SERVER_ERROR,
            e
        );
    }
    private constructor(devMessage: string, httpErr: HTTPErrorType, raw: any) {
        super(devMessage, httpErr, raw);
    }
}

export type DBError = DBReadError | DBWriteError | DBUpdateError;

export class DBReadError extends BaseError {
    public static create<T extends object>(
        collection: string,
        query: RootQuerySelector<T>,
        raw: any
    ) {
        const devMessage = `Database read operation failed when querying collection: ${collection} with query: ${JSON.stringify(
            query
        )}`;
        return new DBReadError(devMessage, raw);
    }
    private constructor(devMessage: string, raw: any) {
        super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
    }
}

export class DBWriteError extends BaseError {
    public static create<T extends object>(
        collection: string,
        docType: T,
        raw: any
    ) {
        const devMessage = `Database write operation failed while writing the following document:\n${JSON.stringify(
            docType
        )} to the ${collection} collection`;
        return new DBWriteError(devMessage, raw);
    }
    private constructor(devMessage: string, raw: any) {
        super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
    }
}

export class DBUpdateError extends BaseError {
    public static create<T extends object>(
        collection: string,
        filter: T,
        raw: any
    ) {
        const devMessage = `Database update operation failed for document matching the following filter: ${JSON.stringify(
            filter
        )}, on collection ${collection}`;
        return new DBUpdateError(devMessage, raw);
    }
    private constructor(devMessage: string, raw: any) {
        super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
    }
}

export class MissingCollectionOrDBError extends BaseError {
    public static create(missingCollectionOrDB: string, raw: any) {
        const devMessage = `Database connection failed because the following db or collection was missing: ${missingCollectionOrDB}`;
        return new MissingCollectionOrDBError(devMessage, raw);
    }
    private constructor(devMessage: string, raw: any) {
        super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
    }
}
